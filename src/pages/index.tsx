import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';

export default function Home() {
  const [stage1Rank, setStage1Rank] = useState<number>(0);
  const [stage2Rank, setStage2Rank] = useState<number>(0);
  const [discordRole, setDiscordRole] = useState<string>('None');
  const [isProver, setIsProver] = useState<boolean>(false);
  const [kaitoRank, setKaitoRank] = useState<number>(0);
  const [isNodeRunner, setIsNodeRunner] = useState<boolean>(false);
  const [result, setResult] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const calculateTokens = () => {
    // Input validation
    if (stage1Rank > 25000 || (stage1Rank < 0 && stage1Rank !== 0)) {
      setError('Stage 1 Rank must be between 1 and 25,000 (or 0 if not ranked)');
      return;
    }
    if (stage2Rank > 4000 || (stage2Rank < 0 && stage2Rank !== 0)) {
      setError('Stage 2 Rank must be between 1 and 4,000 (or 0 if not ranked)');
      return;
    }
    if (kaitoRank > 1000 || (kaitoRank < 0 && kaitoRank !== 0)) {
      setError('Kaito Rank must be between 1 and 1,000 (or 0 if not ranked)');
      return;
    }

    setError('');
    setIsRolling(true);
    setTimeout(() => {
      let totalTokens = 0;
      const totalSupply = 1_000_000_000;
      const airdropAllocation = totalSupply * 0.10; // 10% for airdrop

      // Stage 1: 5% (50M tokens) for 25k participants
      if (stage1Rank > 0 && stage1Rank <= 25000) {
        totalTokens += 4000 - ((stage1Rank - 1) * (4000 - 1000) / (25000 - 1));
      }

      // Stage 2: 2% (20M tokens) for 4k participants
      if (stage2Rank > 0 && stage2Rank <= 4000) {
        totalTokens += 7500 - ((stage2Rank - 1) * (7500 - 2500) / (4000 - 1));
      }

      // Discord Roles: 0.5% (5M tokens) for 350 holders
      if (discordRole === 'L3') totalTokens += 1000000 / 50;
      else if (discordRole === 'L2') totalTokens += 1500000 / 100;
      else if (discordRole === 'L1') totalTokens += 2500000 / 200;

      // Stage 2.5: 0.25% (2.5M tokens) for 250 provers
      const stage25Pool = airdropAllocation * 0.0025;
      if (isProver) totalTokens += stage25Pool / 250;

      // Node Runners: 0.25% (2.5M tokens) for 170 runners
      const nodePool = airdropAllocation * 0.0025;
      if (isNodeRunner) totalTokens += nodePool / 170;

      // Yappers: 1% (10M tokens) for top 1k Kaito leaderboard
      if (kaitoRank > 0 && kaitoRank <= 1000) {
        totalTokens += 15000 - ((kaitoRank - 1) * (15000 - 5000) / (1000 - 1));
      }

      setResult(totalTokens);
      setIsRolling(false);
    }, 2000); // 2-second "roll" effect
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col items-center justify-center p-4">
      <Head>
        <title>Succinct Airdrop Checker</title>
      </Head>
      <div className="w-full max-w-md bg-pink-100 p-6 rounded-lg shadow-lg">
        <div className="flex justify-center mb-4">
          <Image src="/succinct-logo.png" alt="Succinct Logo" width={150} height={50} />
        </div>
        <h1 className="text-2xl font-bold text-center text-pink-600 mb-4">
          Succinct Airdrop Checker
        </h1>
        <p className="text-sm text-center text-red-600 mb-4">
          Disclaimer: This is a simulation. No wallet connection is needed.
        </p>

        {error && (
          <p className="text-sm text-center text-red-600 mb-4">{error}</p>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Testnet Stage 1 Rank (1-25,000, leave 0 if not ranked)
            </label>
            <input
              type="number"
              value={stage1Rank}
              onChange={(e) => setStage1Rank(Math.min(Math.max(Number(e.target.value), 0), 25000))}
              className="mt-1 p-2 w-full border rounded-md focus:ring-pink-500 focus:border-pink-500"
              placeholder="Enter your rank"
              min={0}
              max={25000}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Testnet Stage 2 Rank (1-4,000, leave 0 if not ranked)
            </label>
            <input
              type="number"
              value={stage2Rank}
              onChange={(e) => setStage2Rank(Math.min(Math.max(Number(e.target.value), 0), 4000))}
              className="mt-1 p-2 w-full border rounded-md focus:ring-pink-500 focus:border-pink-500"
              placeholder="Enter your rank"
              min={0}
              max={4000}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Discord Role
            </label>
            <select
              value={discordRole}
              onChange={(e) => setDiscordRole(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md focus:ring-pink-500 focus:border-pink-500"
            >
              <option value="None">None</option>
              <option value="L1">L1</option>
              <option value="L2">L2</option>
              <option value="L3">L3</option>
            </select>
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isProver}
                onChange={(e) => setIsProver(e.target.checked)}
                className="mr-2 h-4 w-4 text-pink-600 focus:ring-pink-500"
              />
              <span className="text-sm text-gray-700">Testnet Stage 2.5 Prover</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Kaito Leaderboard Rank (1-1000, leave 0 if not ranked)
            </label>
            <input
              type="number"
              value={kaitoRank}
              onChange={(e) => setKaitoRank(Math.min(Math.max(Number(e.target.value), 0), 1000))}
              className="mt-1 p-2 w-full border rounded-md focus:ring-pink-500 focus:border-pink-500"
              placeholder="Enter your rank"
              min={0}
              max={1000}
            />
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isNodeRunner}
                onChange={(e) => setIsNodeRunner(e.target.checked)}
                className="mr-2 h-4 w-4 text-pink-600 focus:ring-pink-500"
              />
              <span className="text-sm text-gray-700">Node Runner</span>
            </label>
          </div>

          <button
            onClick={calculateTokens}
            className={`w-full py-2 px-4 bg-pink-600 text-white rounded-md hover:bg-pink-600 ${
              isRolling ? 'animate-pulse' : ''
            }`}
            disabled={isRolling}
          >
            {isRolling ? 'Calculating...' : 'Calculate Tokens'}
          </button>

          {result !== null && (
            <div className="mt-4 p-4 bg-white rounded-md text-center">
              <p className="text-lg font-semibold text-pink-600">
                Estimated Tokens: {result.toFixed(2)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}