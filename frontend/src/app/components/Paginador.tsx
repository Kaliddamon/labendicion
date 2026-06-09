import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './ui/pagination';

interface PaginadorProps {
  paginaActual: number;
  totalPaginas: number;
  cambiarPagina: (pagina: number) => void;
}

export function Paginador({ paginaActual, totalPaginas, cambiarPagina }: PaginadorProps) {
  if (totalPaginas <= 1) return null;

  let paginas: (number | string)[] = [];

  if (totalPaginas <= 5) {
    for (let i = 1; i <= totalPaginas; i++) {
      paginas.push(i);
    }
  } else {
    if (paginaActual <= 3) {
      paginas = [1, 2, 3, 4, 'ellipsis', totalPaginas];
    } else if (paginaActual >= totalPaginas - 2) {
      paginas = [1, 'ellipsis', totalPaginas - 3, totalPaginas - 2, totalPaginas - 1, totalPaginas];
    } else {
      paginas = [1, 'ellipsis', paginaActual - 1, paginaActual, paginaActual + 1, 'ellipsis', totalPaginas];
    }
  }

  return (
    <Pagination className="mt-8 mb-4">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (paginaActual > 1) cambiarPagina(paginaActual - 1);
            }}
            className={paginaActual === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
          />
        </PaginationItem>
        
        {paginas.map((p, idx) => (
          <PaginationItem key={idx}>
            {p === 'ellipsis' ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  cambiarPagina(p as number);
                }}
                isActive={paginaActual === p}
              >
                {p}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (paginaActual < totalPaginas) cambiarPagina(paginaActual + 1);
            }}
            className={paginaActual === totalPaginas ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
