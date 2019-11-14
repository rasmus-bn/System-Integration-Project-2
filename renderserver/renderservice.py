


'''
docker run --rm -it 
-v filefolder:/media 
ikester/blender:2.79 
/media/scene.blend 
-o /media/output/frame_#### 
-a
'''
import os

install_docker_cmd = '''
apt-get update && \\
apt-get -y install \\
    apt-transport-https \\
    ca-certificates \\
    curl \\
    gnupg2 \\
    software-properties-common && \\
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo apt-key add - && \\
apt-key fingerprint 0EBFCD88 && \\
apt-get -y install docker-ce docker-ce-cli containerd.io && \\
docker run hello-world
'''

os.system(install_docker_cmd)