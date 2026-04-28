import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import App from '../app/App';

describe('App smoke test', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          productos: [],
          empleados: [],
          registros: [],
          tareasAseo: [],
        }),
      })
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders the main navigation cards', async () => {
    render(<App />);
    expect(await screen.findByRole('heading', { name: /hola, equipo/i })).toBeInTheDocument();
  });
});
