Pre-requisites
==============

* Opscode Chef Community account
  * Create account: https://community.opscode.com/users/new
  * Download your validation key (or recreate it from https://community.opscode.com/users/YOUR_USER_NAME/user_key/new)
* VirtualBox
  * Download from: https://www.virtualbox.org/wiki/Downloads
* ruby gems
* bundler
  * to install: sudo gem install bundler

Setup
=====

Create $HOME/.chef directory to hold chef server validation keys and databag decryption keys:

    mkdir ~/.chef

Obtain organisation validation key (attero-validator.pem) and decryption key (attero_encrypted_data_bag_secret) from a team member. Place these files and your personal validation key to your .chef directory:

    mv ~/Downloads/USERNAME.pem ~/.chef
    mv ~/Downloads/attero-validator.pem ~/.chef
    mv ~/Downloads/attero_encrypted_data_bag_secret ~/.chef

Fix permissions in the .chef directory:

    chmod 600 ~/.chef/*

Add dev host to hosts file:

    echo "192.168.123.123 dev.attero.local" | sudo tee -a /etc/hosts

Clone git repository:

    cd /wherever/you/put/your/shit/to
    git clone git@github.com:nnevala/attero.git

Install gem bundle, create dev VM:

    cd attero
    bundle install --binstubs
    cd tools/vagrant
    bundle exec vagrant up

Usage
=====

SSH to VM:

    cd $REPO_DIR/tools/vagrant
    bundle exec vagrant ssh

Start Play:

    cd /opt/attero/
    sudo play

Open http://dev.attero.local:9000 in a browser.

Vagrant Commands
================

    bundle exec vagrant up          # starts the vm
    bundle exec vagrant suspend     # suspends state to disk
    bundle exec vagrant resume      # resumes suspended vm
    bundle exec vagrant halt        # shuts downs the vm
    bundle exec vagrant destroy     # completely removes the vm from virtualbox

NB! If you destroy your machine, you have to remove the corresponding chef client and node from the chef server to be able to recreate it!

Nodes: https://manage.opscode.com/nodes
Clients: https://manage.opscode.com/clients

