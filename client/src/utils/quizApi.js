export const completeRound = async (roundId, teamId, data) => {
    console.log(`[Mock Quiz API] Completing round ${roundId} for team ${teamId}`, data);
    // In a real implementation, this would make an API call using apiClient
    // return apiPost('/quiz/complete-round', { roundId, teamId, ...data });
    return Promise.resolve({ success: true, message: "Round completed (mock)" });
};
