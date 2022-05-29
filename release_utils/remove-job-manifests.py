import re

# Jobs are immutable and if we do kubectl apply with one without deleting it on the cluster, the api will throw an error

if __name__ == '__main__':
    with open("jlh-rendered.yaml", "r+") as f:
        text = f.read()
        f.seek(0)
        manifests = re.split("---\n", text)  # Break file into individual manifests
        for manifest in manifests:
            # Write manifests back to file but skip any Jobs
            if manifest.startswith("apiVersion: batch/v1\nkind: Job"):
                print("Deleting Job manifest")
            else:
                manifest_with_separator = manifest + "---\n"
                print(manifest_with_separator, end='')
                f.write(manifest_with_separator)
        f.truncate()  # https://stackoverflow.com/a/2424410
