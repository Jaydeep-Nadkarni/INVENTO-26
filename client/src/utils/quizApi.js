export const completeRound = async (roundId, teamId, data) => {
    console.log(`[Mock Quiz API] Completing round ${roundId} for team ${teamId}`, data);
    return Promise.resolve({ success: true, message: "Round completed (mock)" });
};
