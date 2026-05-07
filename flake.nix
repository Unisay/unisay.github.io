{
  description = "Yuriy Lazaryev CV build pipeline";
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  outputs = { self, nixpkgs }: let
    system = "x86_64-linux";
    pkgs = nixpkgs.legacyPackages.${system};
  in {
    devShells.${system}.default = pkgs.mkShell {
      buildInputs = [ pkgs.yq-go pkgs.jq pkgs.resumed pkgs.chromium pkgs.nodejs ];
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

      fontsConf = pkgs.makeFontsConf { fontDirectories = [ pkgs.inter ]; };

      pdf = pkgs.stdenv.mkDerivation {
        name = "cv-pdf";
        src = ./.;
        buildInputs = [ pkgs.yq-go pkgs.jq pkgs.resumed pkgs.chromium pkgs.inter pkgs.fontconfig ];
        buildPhase = ''
          yq -o json resume.yaml > resume.json
          yq -o json overlays/pdf.yaml > overlay.json
          jq --slurpfile overlay overlay.json '
            if $overlay[0].basics.summary then .basics.summary = $overlay[0].basics.summary else . end
            | .work |= map(
                . as $job
                | [($overlay[0].work[] | select(.name == $job.name))] as $matches
                | if ($matches | length) > 0 then .highlights = $matches[0].highlights else . end
              )
            | del(.interests)
            | del(.references)
          ' resume.json > resume-pdf.json
          resumed export resume-pdf.json --theme "$(pwd)/theme/pdf.js" --output index-pdf.html
          INTER_TTF="${pkgs.inter}/share/fonts/truetype/InterVariable.ttf"
          sed "s|<link href=\"https://fonts.googleapis.com/css2?family=Inter[^\"]*\" rel=\"stylesheet\">|<style>@font-face { font-family: 'Inter'; src: url('file://$INTER_TTF') format('truetype'); font-weight: 100 900; }</style>|" index-pdf.html > index-for-pdf.html
          export FONTCONFIG_FILE=${fontsConf}
          export HOME=$(mktemp -d)
          chromium --headless --disable-gpu --no-sandbox \
            --disable-dev-shm-usage \
            --run-all-compositor-stages-before-draw \
            --print-to-pdf="$(pwd)/resume.pdf" \
            --no-pdf-header-footer \
            "file://$(pwd)/index-for-pdf.html"
        '';
        installPhase = ''
          mkdir -p $out
          cp resume.pdf $out/
        '';
      };

      site = pkgs.stdenv.mkDerivation {
        name = "cv-site";
        src = ./.;
        buildInputs = [ pkgs.yq-go pkgs.jq pkgs.resumed pkgs.chromium pkgs.inter pkgs.fontconfig ];
        buildPhase = ''
          # Full web version
          yq -o json resume.yaml > resume.json
          resumed export resume.json --theme "$(pwd)/theme/index.js" --output index.html
          # PDF version (merged overlay via jq)
          yq -o json overlays/pdf.yaml > overlay.json
          jq --slurpfile overlay overlay.json '
            if $overlay[0].basics.summary then .basics.summary = $overlay[0].basics.summary else . end
            | .work |= map(
                . as $job
                | [($overlay[0].work[] | select(.name == $job.name))] as $matches
                | if ($matches | length) > 0 then .highlights = $matches[0].highlights else . end
              )
            | del(.interests)
            | del(.references)
          ' resume.json > resume-pdf.json
          resumed export resume-pdf.json --theme "$(pwd)/theme/pdf.js" --output index-pdf.html
          INTER_TTF="${pkgs.inter}/share/fonts/truetype/InterVariable.ttf"
          sed "s|<link href=\"https://fonts.googleapis.com/css2?family=Inter[^\"]*\" rel=\"stylesheet\">|<style>@font-face { font-family: 'Inter'; src: url('file://$INTER_TTF') format('truetype'); font-weight: 100 900; }</style>|" index-pdf.html > index-for-pdf.html
          export FONTCONFIG_FILE=${fontsConf}
          export HOME=$(mktemp -d)
          chromium --headless --disable-gpu --no-sandbox \
            --disable-dev-shm-usage \
            --run-all-compositor-stages-before-draw \
            --print-to-pdf="$(pwd)/resume.pdf" \
            --no-pdf-header-footer \
            "file://$(pwd)/index-for-pdf.html"
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
