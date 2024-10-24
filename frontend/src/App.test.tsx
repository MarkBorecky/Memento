import React from 'react';
import { render, screen } from '@testing-library/react';
import XxxApp from './xxxApp';

test('renders learn react link', () => {
  render(<XxxApp />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
