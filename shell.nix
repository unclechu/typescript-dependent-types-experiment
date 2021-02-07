let
  defaultNixpkgs = fetchTarball {
    url = "https://github.com/NixOS/nixpkgs/archive/17dd592c980f992f55552a76340d62d3954481ca.tar.gz";
    sha256 = "1r69gal0w0rf53ydfdm3vws4hbimasbyfay9zs6xzhg38p1bdaxm";
  };
in
{ pkgs ? import defaultNixpkgs {}
}:
let
  esc = pkgs.lib.escapeShellArg;
  dash = "${pkgs.dash}/bin/dash";

  my-ts-run = pkgs.writeTextFile rec {
    name = "my-ts-run";
    executable = true;
    destination = "/bin/${name}";

    text = ''
      #! ${dash}
      exec node_modules/.bin/ts-node --compiler-options='{"strict":true}' "$@"
    '';

    checkPhase = ''
      if ! [ -f ${esc dash} -a -r ${esc dash} -a -x ${esc dash} ]; then
        >&2 printf '"%s" is not found or not an executable file!' ${esc dash}
        exit 1
      fi
    '';
  };
in
pkgs.mkShell {
  buildInputs = [
    pkgs.nodejs-14_x
    my-ts-run
  ];

  shellHook = ''
    set -Eeuo pipefail
    if [[ ! -d node_modules ]]; then
      npm install ts-node
    fi
  '';
}
