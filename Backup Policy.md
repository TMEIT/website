# Backup policy

The entire website runs on a single VM. 
All of our state outside of git, that being our postgres database and our SealedSecrets decryption key, are stored on that single VM.

In order to protect from crashing database containers and the possible destruction of our VM, 
we dump our database and back it up every hour to Backblaze B2 Object Storage.
This is the most cost-effective way to keep our data safe.

Database dumps are kept for every hour for up to 2 weeks.
After that, a database dump is kept for every day for an entire year.
After that, a database dump from every month is kept indefinitely.

For security reasons, we use Backblaze's SSE-B2 encryption to keep the database dumps encrypted at rest. 

We also use Object Locking to prevent any database dumps from being deleted for the first two weeks after they have been uploaded. 
This protects the database dumps from potential ransomware attackers deleting the database dumps. 
Note that the application key used to upload the database dumps to Backblaze does not have permission to delete files.

## Future

### Images
We will be implementing user-uploaded images in the near future. 
These images will be uploaded to our server for validation, but they will ultimately be stored in Backblaze B2.
Therefore, they are not at risk from VM destruction, as long as our Backblaze account is kept safe and secure.

### Kubernetes and node state
If the node is destroyed, our database backups mean that we will not lose any data that can't be recovered.

However, there is still somewhat of a long recovery process if the node is destroyed, 
even though everything was configured with code.
For one, all of our database passwords and JWT secrets will have to be regenerated and resealed.
Furthermore, there are still some manual steps involved with starting up the node, 
like resetting the root password from the Hetzner console, installing the Kubernetes operators, and restoring the database dump.

It is possible to skip some of this manual recovery by using a kubernetes backup operator like Velero.
Velero would recreate the kubernetes state from a backup in a streamlined way, reinstalling the operators, 
recovering the sealed secret key, and restoring the database filesystems without even using a database dump.

We may want to consider using Velero in the future if we expect future VM destructions.
