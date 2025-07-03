for d in $(find src/components/Amelipro -type d -name tests); do
  mv "$d" "$(dirname "$d")/__tests__"
done
