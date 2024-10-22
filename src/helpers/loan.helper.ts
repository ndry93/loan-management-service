export const calculateLoanROI = (principalAmount: number = 0, interestAmount: number = 0) => {
    if (principalAmount === 0 || interestAmount === 0) {
        return 0;
    }
    return interestAmount / principalAmount;
};

export const calculateInterestAmount = (principalAmount: number = 0, interestRate: number = 0) => {
    if (principalAmount === 0 || interestRate === 0) {
        return 0;
    }
    return (principalAmount * interestRate) / 100;
};
