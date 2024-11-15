export interface AdminDashboardMetrics {
    totalUsers: number,
    pendingRegistrations: number,
    activeUsers: number,
    disabledUsers: number
}

export interface LoanOfficerDashboardMetrics {
    totalApplications: number,
    applicationsUnderReview: number,
    applicationsApproved: number,
    applicationsRejected: number,
    applicationsPendingFinalApproval: number
}