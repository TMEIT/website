import sys

from _shared import SemVer, K8sDeploymentImageTag

if __name__ == '__main__':
    k8s_image_tag: SemVer = K8sDeploymentImageTag("deploy/kubernetes/tmeit-se/tmeit-app/set_image_tag.json").version

    option: str = sys.argv[-1]
    if option == "gh-actions":  # Store version as a variable for github actions when "gh-actions" is given as an arg
        print("::set-output name=version::" + str(k8s_image_tag))
    else:
        print(str(k8s_image_tag))
