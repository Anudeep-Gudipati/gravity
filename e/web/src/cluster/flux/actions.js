import service from 'oss-app/services/clusters';
import { fetchCluster } from 'oss-app/flux/cluster/actions';
import Logger from 'shared/libs/logger';
const logger = Logger.create('cluster/flux/actions');

export function updateLicense(license){
  return service.updateLicense(license)
    .then(() => fetchCluster()
    .fail(err => {
      logger.error('updateLicense()', err);
    })
  )
}