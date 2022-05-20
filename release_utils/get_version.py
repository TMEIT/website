from _shared import SemVer, K8sDeploymentImageTag

if __name__ == '__main__':
    k8s_image_tag: SemVer = K8sDeploymentImageTag("deploy/tmeit-jlh-name/set_image_tag.json").version
    print(str(k8s_image_tag))
