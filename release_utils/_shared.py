import configparser
import json
import subprocess
from dataclasses import dataclass

@dataclass
class SemVer:
    """A representation of a semantic version string"""
    major: int
    minor: int
    patch: int

    def __init__(self, semver_str: str):
        """Creates a representation of a semantic version string. Only works on strings of the form "xx.yy.zz"."""
        semver_str = semver_str.strip('"')  # Strip quotes inside string
        self.major, self.minor, self.patch = [int(num) for num in semver_str.split(".")]

    # convert back to string
    def __str__(self):
        return f'{self.major}.{self.minor}.{self.patch}'

    # magic comparison functions
    def __eq__(self, other):
        return self.major == other.major \
               and self.minor == other.minor \
               and self.patch == other.patch

    def __gt__(self, other):
        # How to compare semver:
        # https://stackoverflow.com/a/55466348
        if self.major != other.major:
            return self.major > other.major
        elif self.minor != other.minor:
            return self.minor > other.minor
        else:
            return self.patch > other.patch

    def __le__(self, other):
        return (not self == other) and (not self > other)


@dataclass
class FrontVersion:
    package_json_path: str

    @property
    def version(self) -> SemVer:
        with open(self.package_json_path) as front_package_file:
            package = json.load(front_package_file)
        front_ver_str: str = package["version"]
        return SemVer(front_ver_str)

    @version.setter
    def version(self, new_version: SemVer) -> None:
        with open(self.package_json_path, 'r+') as front_package_file:
            package = json.load(front_package_file)
            package['version'] = str(new_version)
            front_package_file.seek(0)
            json.dump(package, front_package_file, indent=2)
            front_package_file.truncate()  # https://stackoverflow.com/a/2424410


@dataclass
class BackVersion:
    pyproject_toml_path: str

    @property
    def version(self) -> SemVer:
        project = configparser.ConfigParser()
        project.read(self.pyproject_toml_path)
        back_ver_str: str = project['tool.poetry']['version']
        return SemVer(back_ver_str)

    @version.setter
    def version(self, new_version: SemVer) -> None:
        project = configparser.ConfigParser()
        project.read(self.pyproject_toml_path)
        project['tool.poetry']['version'] = f'"{str(new_version)}"'  # Output should have double quotes in the string
        with open(self.pyproject_toml_path, 'w') as back_project_file:
            project.write(back_project_file)


@dataclass
class K8sDeploymentImageTag:
    tag_patch_path: str

    @property
    def version(self) -> SemVer:
        with open(self.tag_patch_path) as image_tag_patch:
            patch = json.load(image_tag_patch)
        image_str: str = patch[0]["value"]
        image, tag = image_str.split(":")
        return SemVer(tag)

    @version.setter
    def version(self, new_version: SemVer) -> None:
        with open(self.tag_patch_path, 'r+') as image_tag_patch:
            patch = json.load(image_tag_patch)
            image_str: str = patch[0]["value"]
            image, tag = image_str.split(":")
            new_image_str = f"{image}:{str(new_version)}"
            patch[0]["value"] = new_image_str
            image_tag_patch.seek(0)
            json.dump(patch, image_tag_patch, indent=2)
            image_tag_patch.truncate()  # https://stackoverflow.com/a/2424410


@dataclass
class LatestGitTag:

    @property
    def version(self) -> SemVer:
        latest_tag: bytes = subprocess.run(["git", "describe", "--tags", "--abbrev=0"], capture_output=True).stdout
        return SemVer(latest_tag.decode("utf-8"))
