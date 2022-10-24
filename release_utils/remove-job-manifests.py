import re

# Jobs are immutable and if we do kubectl apply with one without deleting it on the cluster, the api will throw an error

if __name__ == '__main__':
    with open("tmeit-rendered-with-jobs.yaml", "r") as of:
        text = of.read()

    manifests = re.split("---\n", text)  # Break file into individual manifests

    with open("tmeit-rendered.yaml", "w") as f:
        for manifest in manifests:
            # Write manifests to new file but skip any Jobs
            if manifest.startswith("apiVersion: batch/v1\nkind: Job"):
                print("[INFO: Deleting Job manifest]")
            else:
                manifest_with_separator = manifest + "---\n"
                print(manifest_with_separator, end='')
                f.write(manifest_with_separator)
