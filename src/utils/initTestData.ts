import { useBudgetStore } from '../store/budgetStore';
import { generateId } from './generateId';

export const initializeTestData = () => {
  const store = useBudgetStore.getState();

  // Clear existing data to prevent duplication
  if (store.organizations.length > 0) {
    return; // Exit if data already exists
  }

  // Create SampleTestOrg with $5M total budget
  const organization = {
    id: generateId(),
    name: 'SampleTestOrg',
    leaderName: 'Sarah Anderson',
    totalBudget: 5000000,
    departments: []
  };
  store.addOrganization(organization);

  // Create Departments with initial budgets
  const departments = [
    {
      id: generateId(),
      name: 'Engineering',
      departmentHeadName: 'Michael Chen',
      organizationId: organization.id,
      totalBudget: 2000000, // $2M
      managers: []
    },
    {
      id: generateId(),
      name: 'Product Management',
      departmentHeadName: 'Emily Rodriguez',
      organizationId: organization.id,
      totalBudget: 1000000, // $1M
      managers: []
    },
    {
      id: generateId(),
      name: 'Design',
      departmentHeadName: 'David Kim',
      organizationId: organization.id,
      totalBudget: 800000, // $800K
      managers: []
    },
    {
      id: generateId(),
      name: 'Operations',
      departmentHeadName: 'Lisa Thompson',
      organizationId: organization.id,
      totalBudget: 700000, // $700K
      managers: []
    },
    {
      id: generateId(),
      name: 'Customer Success',
      departmentHeadName: 'James Wilson',
      organizationId: organization.id,
      totalBudget: 500000, // $500K
      managers: []
    }
  ];

  departments.forEach(dept => {
    store.addDepartment(dept);
  });

  // Add Engineering Managers and Teams
  const engManager1 = {
    id: generateId(),
    name: 'Alex Kumar',
    departmentId: departments[0].id,
    teams: []
  };
  store.addManager(engManager1);

  const engManager2 = {
    id: generateId(),
    name: 'Maria Garcia',
    departmentId: departments[0].id,
    teams: []
  };
  store.addManager(engManager2);

  // Add Product Manager
  const prodManager1 = {
    id: generateId(),
    name: 'John Smith',
    departmentId: departments[1].id,
    teams: []
  };
  store.addManager(prodManager1);

  // Add Design Managers
  const designManager1 = {
    id: generateId(),
    name: 'Sophie Lee',
    departmentId: departments[2].id,
    teams: []
  };
  store.addManager(designManager1);

  const designManager2 = {
    id: generateId(),
    name: 'Marcus Johnson',
    departmentId: departments[2].id,
    teams: []
  };
  store.addManager(designManager2);

  // Add Operations Managers
  const opsManager1 = {
    id: generateId(),
    name: 'Rachel Green',
    departmentId: departments[3].id,
    teams: []
  };
  store.addManager(opsManager1);

  const opsManager2 = {
    id: generateId(),
    name: 'Daniel Martinez',
    departmentId: departments[3].id,
    teams: []
  };
  store.addManager(opsManager2);

  // Add Customer Success Manager
  const csManager1 = {
    id: generateId(),
    name: 'Emma Watson',
    departmentId: departments[4].id,
    teams: []
  };
  store.addManager(csManager1);

  // Helper function to create budget items with category distribution
  const createBudgetItems = (budgetId: string, totalAmount: number) => {
    const categories = store.budgetCategories;
    const distributions = [
      { categoryId: categories[0].id, percentage: 0.30 }, // Training and Courses: 30%
      { categoryId: categories[1].id, percentage: 0.20 }, // Conferences: 20%
      { categoryId: categories[2].id, percentage: 0.15 }, // Educational Materials: 15%
      { categoryId: categories[3].id, percentage: 0.20 }, // Team Activities: 20%
      { categoryId: categories[4].id, percentage: 0.15 }  // Travel: 15%
    ];

    distributions.forEach(dist => {
      const amount = totalAmount * dist.percentage;
      store.addBudgetItem({
        id: generateId(),
        budgetId,
        budgetCategoryId: dist.categoryId,
        amount,
        description: `Budget allocation for ${categories.find(c => c.id === dist.categoryId)?.name}`
      });
    });
  };

  // Create teams with budgets and budget category allocations
  const createTeamWithBudget = (name: string, managerId: string, amount: number) => {
    const teamId = generateId();
    const budgetId = generateId();
    
    // Create team
    store.addTeam({
      id: teamId,
      name,
      managerId
    });

    // Create budget
    const budget = {
      id: budgetId,
      teamId,
      totalAmount: amount,
      year: 2024,
      budgetItems: []
    };
    
    store.addBudget(budget);
    store.updateTeamBudget(teamId, budgetId);

    // Create budget items with category distribution
    createBudgetItems(budgetId, amount);
  };

  // Engineering Teams
  createTeamWithBudget('Frontend Development', engManager1.id, 600000);
  createTeamWithBudget('Backend Development', engManager1.id, 700000);
  createTeamWithBudget('Mobile Development', engManager2.id, 400000);
  createTeamWithBudget('DevOps', engManager2.id, 300000);

  // Product Teams
  createTeamWithBudget('Core Product', prodManager1.id, 600000);
  createTeamWithBudget('Enterprise Solutions', prodManager1.id, 400000);

  // Design Teams
  createTeamWithBudget('UX Design', designManager1.id, 300000);
  createTeamWithBudget('UI Design', designManager1.id, 250000);
  createTeamWithBudget('Brand Design', designManager2.id, 250000);

  // Operations Teams
  createTeamWithBudget('Infrastructure', opsManager1.id, 400000);
  createTeamWithBudget('Security', opsManager2.id, 300000);

  // Customer Success Teams
  createTeamWithBudget('Customer Support', csManager1.id, 300000);
  createTeamWithBudget('Customer Onboarding', csManager1.id, 200000);
};