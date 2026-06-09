import deepface, os, sys
print("deepface version:", deepface.__version__)
# List available detector modules
pkg_path = os.path.dirname(deepface.__file__)
print("deepface path:", pkg_path)
for f in os.listdir(pkg_path):
    print(" ", f)
