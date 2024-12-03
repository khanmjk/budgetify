import React from 'react';
import { useParams } from 'react-router-dom';
import { useBudgetStore } from '../store/budgetStore';
import { PageHeader } from '../components/common/PageHeader';
import { OrgStructureView } from '../components/organization/OrgStructureView';
import { DollarSign, Users, Briefcase } from 'lucide-react';

export const OrganizationDetails: React.FC = () => {
  const { organizationId } = useParams<{ organizationId: string }>();
  const store = useBudgetStore();
  const organization = store.organizations.find(org => org.id === organizationId);
  
  if (!organizationId || !organization) {
    return <div>Organization not found</div>;
  }

  const departments = store.getDepartmentsByOrganization(organizationId);
  const totalSpent = store.getOrganizationTotalSpent(organizationId);
  const remainingBudget = organization.totalBudget - totalSpent;

  return (
    <div className="space-y-8">
      <PageHeader 
        title={organization.name}
        backUrl="/organizations"
      />

      <div className="grid gap-6 md:grid-cols-3">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <DollarSign className="h-6 w-6 text-indigo-600" />
            <h3 className="ml-2 text-lg font-medium text-gray-900">Budget</h3>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total Budget:</span>
              <span className="font-medium">${organization.totalBudget.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-gray-500">Spent:</span>
              <span className="font-medium">${totalSpent.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-gray-500">Remaining:</span>
              <span className="font-medium">${remainingBudget.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Briefcase className="h-6 w-6 text-indigo-600" />
            <h3 className="ml-2 text-lg font-medium text-gray-900">Departments</h3>
          </div>
          <p className="mt-4 text-2xl font-semibold">{departments.length}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Users className="h-6 w-6 text-indigo-600" />
            <h3 className="ml-2 text-lg font-medium text-gray-900">Leader</h3>
          </div>
          <p className="mt-4 text-gray-900">{organization.leaderName}</p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-medium text-gray-900 mb-6">Organization Structure</h2>
        <OrgStructureView organizationId={organizationId} />
      </div>
    </div>
  );
};