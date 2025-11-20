import OpenAI from 'openai';
import { Player, GameEvent, GameState } from '@/types';

// Initialize OpenAI client
// Note: In a real app, this should be called from a server action or API route to protect the key
// For this MVP/Client-side demo, we'll assume it's safe or use a proxy if needed.
// Ideally, we should use Next.js Server Actions for this.
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || 'mock-key',
  dangerouslyAllowBrowser: true // Only for demo purposes
});

export class AIService {
  /**
   * Generates a life event based on the player's current state
   */
  static async generateLifeEvent(player: Player, gameState: GameState): Promise<GameEvent> {
    if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
      return this.generateMockEvent(player.age);
    }

    const prompt = `
      Generate a realistic financial life event for a ${player.age} year old ${player.profession.title}.
      Current financial status:
      - Monthly Income: $${player.finances.monthlyIncome}
      - Monthly Expenses: $${player.finances.monthlyExpenses}
      - Net Worth: $${player.finances.netWorth}
      - Children: ${player.childrenCount}
      
      Create an event that:
      1. Is age-appropriate
      2. Offers 2-3 meaningful choices
      3. Has educational value
      
      Return strictly valid JSON with this structure:
      {
        "title": "Event Title",
        "description": "Event Description",
        "type": "opportunity|challenge|market|personal",
        "choices": [
          {
            "id": "c1",
            "label": "Choice Label",
            "description": "Description",
            "consequences": {
              "immediate": { "cash": -1000 },
              "recurring": { "passiveIncome": 50 }
            }
          }
        ],
        "educationalContent": "Financial lesson"
      }
    `;

    try {
      const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-3.5-turbo",
        response_format: { type: "json_object" }
      });

      const content = completion.choices[0].message.content;
      if (!content) throw new Error("No content generated");

      const eventData = JSON.parse(content);
      
      return {
        id: Math.random().toString(36).substr(2, 9),
        round: gameState.currentRound,
        aiGenerated: true,
        ...eventData
      };
    } catch (error) {
      console.error("AI Generation failed:", error);
      return this.generateMockEvent(player.age);
    }
  }

  private static generateMockEvent(age: number): GameEvent {
    return {
      id: Math.random().toString(36).substr(2, 9),
      round: 0,
      type: 'opportunity',
      title: 'Unexpected Bonus',
      description: `You received a performance bonus at work at age ${age}.`,
      choices: [
        {
          id: 'c1',
          label: 'Invest it',
          description: 'Put it into a low-risk index fund.',
          consequences: {
            immediate: { cash: -1000, asset: { 
              id: 'stock-1', type: 'stock', name: 'Index Fund', 
              purchasePrice: 1000, currentValue: 1000, monthlyIncome: 5, 
              risk: 'low', liquidityDays: 2, purchaseRound: 0 
            }}
          }
        },
        {
          id: 'c2',
          label: 'Spend it',
          description: 'Buy a new gadget.',
          consequences: {
            immediate: { cash: 0 } // Net zero effect effectively (get 1000, spend 1000)
          }
        }
      ],
      aiGenerated: false,
      educationalContent: "Investing windfalls can accelerate compound interest."
    };
  }
}
