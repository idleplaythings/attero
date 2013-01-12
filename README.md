Pre-requisites
==============

* VirtualBox
  * Download from: https://www.virtualbox.org/wiki/Downloads
* ruby gems
* bundler
  * to install: sudo gem install bundler

Setup
=====

Add dev host to hosts file

    echo "192.168.123.123 dev.attero.local" | sudo tee -a /etc/hosts

Install gem bundle, create dev VM

    cd $REPO_DIR
    bundle install --binstubs
    cd tools/vagrant
    bundle exec vagrant up

Usage
=====

    cd $REPO_DIR/tools/vagrant
    bundle exec vagrant ssh
