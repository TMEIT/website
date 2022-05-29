import sys

from _shared import SemVer, FrontVersion, BackVersion, K8sDeploymentImageTag

if __name__ == '__main__':
    desired_version: str = sys.argv[-1]
    new_semver = SemVer(desired_version)

    FrontVersion("front/package.json").version = new_semver
    BackVersion("back/pyproject.toml").version = new_semver
    K8sDeploymentImageTag("deploy/tmeit-jlh-name/tmeit-app/set_image_tag.json").version = new_semver
    K8sDeploymentImageTag("deploy/tmeit-jlh-name/run-migrations/set_image_tag.json").version = new_semver
    print(f'Release version set to "{str(new_semver)}" for front-end, back-end, and image tags.')
