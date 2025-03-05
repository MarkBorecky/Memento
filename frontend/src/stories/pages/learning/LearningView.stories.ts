import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { ClosedQuestionTest } from '../../../pages/learning/ClosedQuestionTest';
import { MemoryRouter } from 'react-router-dom';
import { number } from 'prop-types';

const meta = {
    title: 'Example/Page',
    component: ClosedQuestionTest,
    parameters: {
        layout: 'fullscreen',
    },
    argTypes: {
        cards: {
            control: 'object',
            description: 'Array of flashcards',
        }   
    }
} satisfies Meta<typeof ClosedQuestionTest>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LearningViewExample: Story = {
    args: {
        cards: [
            {
                cardId: 0,
                question: "twarz",
                correctAnswer: "das Gesicht",
                correctAnswerCount: 0,
                promptAnswers: [
                    "das T-Shirt",
                    "die Falte",
                    "der Schnurrbart",
                    "das Gesicht"
                ]
            },
            {
                cardId: 1,
                question: "szeroki",
                correctAnswer: "breit",
                correctAnswerCount: 0,
                promptAnswers: [
                    "breit",
                    "Gesicht",
                    "klein",
                    "der Geburtsort"
                ]
            },
            {
                cardId: 2,
                question: "pryszczaty",
                correctAnswer: "picklig",
                correctAnswerCount: 0,
                promptAnswers: [
                    "picklig",
                    "der Schlafanzug",
                    "der Braten",
                    "schön"
                ]
            },
        ],
    },
};