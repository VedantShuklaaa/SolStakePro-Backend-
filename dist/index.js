"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post('/api/calculator/stakedSol', (req, res) => {
    try {
        const { totalSolStaked, annualPercentageYield, validatorsCommision } = req.body;
        if (!totalSolStaked) {
            throw new Error(`please enter the total number of staked Solana`);
        }
        if (!annualPercentageYield) {
            throw new Error(`please enter the annual percentage yield given by your validator`);
        }
        if (!validatorsCommision) {
            throw new Error(`please enter the validator's commission`);
        }
        let annual_return = 0;
        if (typeof annualPercentageYield == 'number' && typeof validatorsCommision == 'number') {
            const VC = validatorsCommision / 100;
            const net_APY = (annualPercentageYield * (1 - VC)) / 100;
            if (typeof totalSolStaked == 'number') {
                annual_return = net_APY * totalSolStaked;
                console.log(`annual returns: `, annual_return);
                return res.status(200).send({
                    message: `calculations successful`,
                    annual_return
                });
            }
            return res.send({
                message: 'type error with staked solana'
            });
        }
        return res.send({
            message: 'type error in annual percentage yield or validators commission'
        });
    }
    catch (err) {
        console.error('Error: ', err);
        return res.status(500).json({
            error: 'internal server error',
            message: `something's up with the server!`
        });
    }
});
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is currently running on ${PORT}`);
});
