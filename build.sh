#!/bin/bash

set -e

cd dev/builder/
. build.sh --skip-omitted-in-build-config --no-ie-checks --no-zip --no-tar

cd ../../
(rm -rf ../ckeditor/* && mv dev/builder/release/ckeditor/* ../ckeditor/)

echo "Release moved to ckeditor directory"
