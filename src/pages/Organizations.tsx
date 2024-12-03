import React from 'react';
import { Link } from 'react-router-dom';
import { useBudgetStore } from '../store/budgetStore';
import { PageHeader } from '../components/common/PageHeader';
import { PlusCircle, Building2, ChevronRight } from 'lucide-react';

export const Organizations: React.FC = () => {
  const organizations = useBudgetStore(state => state.organizations);
  const getDepartmentsByOrganization = useBudgetStore(state => state.getDepartmentsByOrganization);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <PageHeader title="Organizations" />
        <Link
          to="/organization/new"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Add Organization
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {organizations.map(org => {
          const departments = getDepartmentsByOrganization(org.id);
          return (
            <Link
              key={org.id}
              to={`/organization/${org.id}`}
              className="block bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Building2 className="h-6 w-6 text-indigo-600 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">{org.name}</h3>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Leader: {org.leaderName}</p>
                <p className="text-sm text-gray-500">
                  {departments.length} {departments.length === 1 ? 'Department' : 'Departments'}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};