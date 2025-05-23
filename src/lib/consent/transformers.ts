
import { ApiConsentApplication, GroupedConsentRequest, ConsentRequest } from '@/types';

// Transform API data to GroupedConsentRequest format
export function transformApiDataToGroupedRequests(apiData: ApiConsentApplication[]): GroupedConsentRequest[] {
  const groupedRequests: GroupedConsentRequest[] = [];
  
  apiData.forEach(app => {
    app.data_sets.forEach(dataSet => {
      const groupId = `${app.app_id}_${dataSet.name}`;
      
      groupedRequests.push({
        groupId,
        appId: app.app_id,
        appName: app.name,
        dataSetName: dataSet.name,
        fields: dataSet.fields.map(field => ({
          fieldName: field.name,
          actions: field.actions
        })),
        purpose: dataSet.purpose,
        status: app.status === 'pending' ? 'requested' : app.status,
        requestedAt: app.created_at,
        expiryDate: dataSet.expiry_date
      });
    });
  });
  
  return groupedRequests;
}

// Transform grouped requests to individual consent requests
export function transformGroupedToIndividualRequests(groupedRequests: GroupedConsentRequest[]): ConsentRequest[] {
  const individualRequests: ConsentRequest[] = [];
  
  groupedRequests.forEach(group => {
    group.fields.forEach(field => {
      individualRequests.push({
        appId: group.appId,
        appName: group.appName,
        userId: "user1", // Mock user ID
        vaultId: "vault1", // Mock vault ID
        dataSetName: group.dataSetName,
        fieldName: field.fieldName,
        actions: field.actions,
        purpose: group.purpose,
        status: group.status,
        requestedAt: group.requestedAt,
        expiryDate: group.expiryDate,
        groupId: group.groupId
      });
    });
  });
  
  return individualRequests;
}
