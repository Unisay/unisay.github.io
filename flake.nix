{
  description = "Yuriy Lazaryev CV build pipeline";
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  outputs = { self, nixpkgs }: let
    system = "x86_64-linux";
    pkgs = nixpkgs.legacyPackages.${system};
  in {
    devShells.${system}.default = pkgs.mkShell {
      buildInputs = [ pkgs.yq-go pkgs.jq pkgs.resumed pkgs.chromium pkgs.wkhtmltopdf pkgs.nodejs ];
    };
    packages.${system} = rec {
      default = site;

      html = pkgs.stdenv.mkDerivation {
        name = "cv-html";
        src = ./.;
        buildInputs = [ pkgs.yq-go pkgs.resumed ];
        buildPhase = ''
          yq -o json resume.yaml > resume.json
          resumed export resume.json --theme "$(pwd)/theme/index.js" --output index.html
        '';
        installPhase = ''
          mkdir -p $out
          cp index.html $out/
        '';
      };

      pdf = pkgs.stdenv.mkDerivation {
        name = "cv-pdf";
        src = ./.;
        buildInputs = [ pkgs.yq-go pkgs.jq pkgs.resumed pkgs.wkhtmltopdf ];
        buildPhase = ''
          yq -o json resume.yaml > resume.json
          yq -o json overlays/pdf.yaml > overlay.json
          jq --slurpfile overlay overlay.json '
            .basics.summary = $overlay[0].basics.summary
            | .work |= map(
                . as $job
                | ($overlay[0].work[] | select(.name == $job.name)) as $match
                | if $match then .highlights = $match.highlights else . end
              )
            | del(.interests)
          ' resume.json > resume-pdf.json
          resumed export resume-pdf.json --theme "$(pwd)/theme/pdf.js" --output index.html
          sed '/fonts.googleapis.com/d' index.html > index-for-pdf.html
          wkhtmltopdf --enable-local-file-access --print-media-type \
            --page-size A4 --margin-top 10mm --margin-bottom 10mm \
            --margin-left 12mm --margin-right 12mm \
            index-for-pdf.html resume.pdf
        '';
        installPhase = ''
          mkdir -p $out
          cp resume.pdf $out/
        '';
      };

      site = pkgs.stdenv.mkDerivation {
        name = "cv-site";
        src = ./.;
        buildInputs = [ pkgs.yq-go pkgs.jq pkgs.resumed pkgs.wkhtmltopdf ];
        buildPhase = ''
          # Full web version
          yq -o json resume.yaml > resume.json
          resumed export resume.json --theme "$(pwd)/theme/index.js" --output index.html
          # PDF version (merged overlay via jq)
          yq -o json overlays/pdf.yaml > overlay.json
          jq --slurpfile overlay overlay.json '
            .basics.summary = $overlay[0].basics.summary
            | .work |= map(
                . as $job
                | ($overlay[0].work[] | select(.name == $job.name)) as $match
                | if $match then .highlights = $match.highlights else . end
              )
            | del(.interests)
          ' resume.json > resume-pdf.json
          resumed export resume-pdf.json --theme "$(pwd)/theme/pdf.js" --output index-pdf.html
          sed '/fonts.googleapis.com/d' index-pdf.html > index-for-pdf.html
          wkhtmltopdf --enable-local-file-access --print-media-type \
            --page-size A4 --margin-top 10mm --margin-bottom 10mm \
            --margin-left 12mm --margin-right 12mm \
            index-for-pdf.html resume.pdf
        '';
        installPhase = ''
          mkdir -p $out
          cp index.html $out/
          cp resume.pdf $out/
          cp resume.json $out/
          cp resume.yaml $out/
          echo "cv.functional.work" > $out/CNAME
        '';
      };
    };
  };
}
