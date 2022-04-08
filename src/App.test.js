import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders With out Crashing', () => {
  const div = document.createElement("div");
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
