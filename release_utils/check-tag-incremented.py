import json
from dataclasses import dataclass

from _shared import SemVer, FrontVersion, BackVersion, K8sDeploymentImageTag, LatestGitTag


if __name__ == '__main__':
    front_ver: SemVer = FrontVersion("front/package.json").version
    back_ver: SemVer = BackVersion("back/pyproject.toml").version
    k8s_image_tag: SemVer = K8sDeploymentImageTag("deploy/tmeit-jlh-name/set_image_tag.json").version

    # Check if all versions are the same
    if k8s_image_tag != front_ver or k8s_image_tag != back_ver:
        raise RuntimeError(f"Versions do not match! ({front_ver=}, {back_ver=}, {k8s_image_tag=})")
    else:
        print("Versions match.")

    # Check that versions have been incremented since last release
    last_release: SemVer = LatestGitTag().version
    if k8s_image_tag == last_release or k8s_image_tag < last_release:
        raise RuntimeError("Versions have not been incremented! "
                           f"Last version: {last_release}, Current version: {k8s_image_tag}\n"
                           "Maybe try incrementing the version with this command:\n"
                           "python release_utils/set_new_version.py 0.0.1")
    else:
        print("Versions have been incremented, ready to release.")
