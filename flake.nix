{
  description = "Yuriy Lazaryev CV build pipeline";
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  outputs = { self, nixpkgs }: let
    system = "x86_64-linux";
    pkgs = nixpkgs.legacyPackages.${system};
  in {
    devShells.${system}.default = pkgs.mkShell {
      buildInputs = [ pkgs.yq-go pkgs.resumed pkgs.chromium pkgs.wkhtmltopdf pkgs.nodejs ];
    };
    packages.${system} = rec {
      default = site;

      html = pkgs.stdenv.mkDerivation {
        name = "cv-html";
        src = ./.;
        buildInputs = [ pkgs.yq-go pkgs.resumed ];
        buildPhase = ''
          yq -o json resume.yaml > resume.json
          resumed export --resume resume.json --theme "$(pwd)/theme/index.js" --output index.html
        '';
        installPhase = ''
          mkdir -p $out
          cp index.html $out/
        '';
      };

      site = pkgs.stdenv.mkDerivation {
        name = "cv-site";
        src = ./.;
        buildInputs = [ pkgs.yq-go pkgs.resumed pkgs.wkhtmltopdf ];
        buildPhase = ''
          yq -o json resume.yaml > resume.json
          resumed export --resume resume.json --theme "$(pwd)/theme/index.js" --output index.html
          wkhtmltopdf --enable-local-file-access --print-media-type \
            --page-size A4 --margin-top 10mm --margin-bottom 10mm \
            --margin-left 10mm --margin-right 10mm \
            index.html resume.pdf
        '';
        installPhase = ''
          mkdir -p $out
          cp index.html $out/
          cp resume.pdf $out/
          echo "cv.functional.work" > $out/CNAME
        '';
      };
    };
  };
}
