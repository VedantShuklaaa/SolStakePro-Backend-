"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors")); // Add this import
const app = (0, express_1.default)();
// Add CORS middleware
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000', // Your frontend URL
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));
app.use(express_1.default.json());
app.get('/api/calculator/stakedSol', (req, res) => {
    res.send({
        message: `fetch some shi man`
    });
});
app.post('/api/calculator/stakedSol', (req, res) => {
    try {
        const { totalSolStaked, annualPercentageYield, validatorsCommision } = req.body;
        if (!totalSolStaked) {
            return res.status(400).json({
                message: `please enter the total number of staked Solana`
            });
        }
        if (!annualPercentageYield) {
            return res.status(400).json({
                message: `please enter the annual percentage yield given by your validator`
            });
        }
        if (!validatorsCommision) {
            return res.status(400).json({
                message: `please enter the validator's commission`
            });
        }
        // Convert strings to numbers and validate
        const totalSolStakedNum = Number(totalSolStaked);
        const annualPercentageYieldNum = Number(annualPercentageYield);
        const validatorsCommisionNum = Number(validatorsCommision);
        if (isNaN(totalSolStakedNum) || totalSolStakedNum <= 0) {
            return res.status(400).json({
                message: 'Invalid staked SOL amount'
            });
        }
        if (isNaN(annualPercentageYieldNum) || annualPercentageYieldNum <= 0) {
            return res.status(400).json({
                message: 'Invalid APY value'
            });
        }
        if (isNaN(validatorsCommisionNum) || validatorsCommisionNum < 0 || validatorsCommisionNum > 100) {
            return res.status(400).json({
                message: 'Invalid validator commission (should be 0-100)'
            });
        }
        const VC = validatorsCommisionNum / 100;
        const net_APY = (annualPercentageYieldNum * (1 - VC)) / 100;
        const annual_return = net_APY * totalSolStakedNum;
        const monthly_return = annual_return / 12;
        const daily_return = annual_return / 365; // Changed from 366 to 365
        console.log(`annual returns: `, annual_return);
        console.log(`monthly returns: `, monthly_return);
        console.log(`daily returns: `, daily_return);
        console.log(`net APY: `, net_APY);
        return res.status(200).json({
            message: `calculations successful`,
            data: {
                daily_return: daily_return.toFixed(4),
                monthly_return: monthly_return.toFixed(4),
                annual_return: annual_return.toFixed(4),
                net_APY: (net_APY * 100).toFixed(2) // Return as percentage
            }
        });
    }
    catch (err) {
        console.error('Error: ', err);
        return res.status(500).json({
            error: 'internal server error',
            message: err.message || `something's up with the server!`
        });
    }
});
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is currently running on ${PORT}`);
});
