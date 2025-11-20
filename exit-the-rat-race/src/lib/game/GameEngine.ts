import { Player, Asset, Liability, MarketConditions, GameEvent, Profession } from '@/types';

export class GameEngine {
  // Constants
  private static readonly TAX_RATE = 0.2; // Simplified tax
  private static readonly CHILD_COST_INFLATION = 0.03;

  /**
   * Calculates the player's current financial standing
   */
  public static calculateFinances(player: Player): Player {
    const passiveIncome = player.assets.reduce((sum, asset) => sum + asset.monthlyIncome, 0);
    const totalIncome = player.profession.salary + passiveIncome;
    
    const liabilityExpenses = player.liabilities.reduce((sum, liability) => sum + liability.monthlyPayment, 0);
    const childExpenses = player.childrenCount * player.profession.expenses.perChild;
    const totalExpenses = 
      player.profession.expenses.taxes +
      player.profession.expenses.mortgage +
      player.profession.expenses.schoolLoans +
      player.profession.expenses.carLoans +
      player.profession.expenses.creditCard +
      player.profession.expenses.other +
      liabilityExpenses +
      childExpenses;

    const assetValue = player.assets.reduce((sum, asset) => sum + asset.currentValue, 0);
    const liabilityValue = player.liabilities.reduce((sum, liability) => sum + liability.amount, 0);
    const netWorth = assetValue - liabilityValue + player.finances.cashOnHand;

    return {
      ...player,
      finances: {
        ...player.finances,
        monthlyIncome: player.profession.salary,
        passiveIncome,
        totalIncome,
        monthlyExpenses: totalExpenses,
        netWorth
      },
      isFinancialFree: passiveIncome > totalExpenses
    };
  }

  /**
   * Process a monthly pay cycle (Payday)
   */
  public static processPayday(player: Player): Player {
    const updatedPlayer = this.calculateFinances(player);
    const cashFlow = updatedPlayer.finances.totalIncome - updatedPlayer.finances.monthlyExpenses;
    
    return {
      ...updatedPlayer,
      finances: {
        ...updatedPlayer.finances,
        cashOnHand: updatedPlayer.finances.cashOnHand + cashFlow
      }
    };
  }

  /**
   * Check if player has won
   */
  public static checkVictory(player: Player): boolean {
    return player.finances.passiveIncome > player.finances.monthlyExpenses;
  }

  /**
   * Buy an asset
   */
  public static buyAsset(player: Player, asset: Asset): Player {
    if (player.finances.cashOnHand < asset.purchasePrice) {
      throw new Error("Insufficient funds");
    }

    const newAssets = [...player.assets, asset];
    const newCash = player.finances.cashOnHand - asset.purchasePrice;

    const updatedPlayer = {
      ...player,
      assets: newAssets,
      finances: {
        ...player.finances,
        cashOnHand: newCash
      }
    };

    return this.calculateFinances(updatedPlayer);
  }

  /**
   * Sell an asset
   */
  public static sellAsset(player: Player, assetId: string, marketMultiplier: number = 1.0): Player {
    const assetIndex = player.assets.findIndex(a => a.id === assetId);
    if (assetIndex === -1) throw new Error("Asset not found");

    const asset = player.assets[assetIndex];
    const salePrice = asset.currentValue * marketMultiplier;
    
    const newAssets = [...player.assets];
    newAssets.splice(assetIndex, 1);

    const updatedPlayer = {
      ...player,
      assets: newAssets,
      finances: {
        ...player.finances,
        cashOnHand: player.finances.cashOnHand + salePrice
      }
    };

    return this.calculateFinances(updatedPlayer);
  }

  /**
   * Add a child
   */
  public static addChild(player: Player): Player {
    const updatedPlayer = {
      ...player,
      childrenCount: player.childrenCount + 1
    };
    return this.calculateFinances(updatedPlayer);
  }

  /**
   * Take out a loan (Liability)
   */
  public static takeLoan(player: Player, amount: number, interestRate: number = 0.1): Player {
    const monthlyPayment = (amount * interestRate) / 12; // Simplified interest only for game mechanics usually
    // Or standard amortization. Let's use simple 10% monthly payment of total loan for game speed? 
    // Actually, Cashflow game uses 10% of loan amount as monthly payment for bank loans usually? 
    // Let's stick to a standard simple interest for now: 1% per month (12% APR)
    const payment = amount * 0.01; 

    const newLiability: Liability = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'Bank Loan',
      amount: amount,
      monthlyPayment: payment,
      interestRate: 0.12
    };

    const updatedPlayer = {
      ...player,
      liabilities: [...player.liabilities, newLiability],
      finances: {
        ...player.finances,
        cashOnHand: player.finances.cashOnHand + amount
      }
    };

    return this.calculateFinances(updatedPlayer);
  }

  /**
   * Repay a liability
   */
  public static repayLiability(player: Player, liabilityId: string): Player {
    const liabilityIndex = player.liabilities.findIndex(l => l.id === liabilityId);
    if (liabilityIndex === -1) throw new Error("Liability not found");

    const liability = player.liabilities[liabilityIndex];
    if (player.finances.cashOnHand < liability.amount) throw new Error("Insufficient funds");

    const newLiabilities = [...player.liabilities];
    newLiabilities.splice(liabilityIndex, 1);

    const updatedPlayer = {
      ...player,
      liabilities: newLiabilities,
      finances: {
        ...player.finances,
        cashOnHand: player.finances.cashOnHand - liability.amount
      }
    };

    return this.calculateFinances(updatedPlayer);
  }
}
