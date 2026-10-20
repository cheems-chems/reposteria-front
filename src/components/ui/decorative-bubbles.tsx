/*
  Volitas globales en bandas CSS de 600 px que alternan las variantes A y B.
  Cada banda tiene tres círculos grandes y medianos. El fondo se
  repite en Y y la capa se recorta sola, sin animaciones ni nodos por burbuja.
*/

const BUBBLE_BLOCK_A = `
  radial-gradient(circle 100px at -4px 124px, rgb(255 214 226 / 50%) 99%, transparent 100%),
  radial-gradient(circle 52px at calc(100% - 60px) 232px, rgb(255 214 226 / 50%) 99%, transparent 100%),
  radial-gradient(circle 44px at 8px 556px, rgb(255 214 226 / 50%) 99%, transparent 100%)
`;

const BUBBLE_BLOCK_B = `
  radial-gradient(circle 105px at calc(100% + 2px) 124px, rgb(255 214 226 / 50%) 99%, transparent 100%),
  radial-gradient(circle 48px at 58px 218px, rgb(249 168 192 / 65%) 99%, transparent 100%),
  radial-gradient(circle 48px at calc(100% + 4px) 550px, rgb(255 214 226 / 50%) 99%, transparent 100%)
`;

const BUBBLE_BLOCK_A_DESKTOP = `
  radial-gradient(circle 160px at -10px 190px, rgb(255 214 226 / 50%) 99%, transparent 100%),
  radial-gradient(circle 62px at 18% 258px, rgb(255 214 226 / 50%) 99%, transparent 100%),
  radial-gradient(circle 56px at 14% 558px, rgb(255 214 226 / 50%) 99%, transparent 100%)
`;

const BUBBLE_BLOCK_B_DESKTOP = `
  radial-gradient(circle 170px at calc(100% + 10px) 180px, rgb(255 214 226 / 50%) 99%, transparent 100%),
  radial-gradient(circle 60px at 82% 250px, rgb(249 168 192 / 65%) 99%, transparent 100%),
  radial-gradient(circle 64px at calc(100% + 4px) 555px, rgb(255 214 226 / 50%) 99%, transparent 100%)
`;

export function PageBubbles() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 select-none overflow-hidden"
      data-page-bubbles
    >
      <style>{`
        [data-page-bubbles] {
          background-image: ${BUBBLE_BLOCK_A};
          background-size: 100% 1200px;
          background-position: 0 0;
          background-repeat: repeat-y;
        }
        [data-page-bubbles]::after {
          content: "";
          position: absolute;
          inset: 0;
          background-image: ${BUBBLE_BLOCK_B};
          background-size: 100% 1200px;
          background-repeat: repeat-y;
          background-position: 0 600px;
        }
        @media (min-width: 768px) {
          [data-page-bubbles] { background-image: ${BUBBLE_BLOCK_A_DESKTOP}; }
          [data-page-bubbles]::after {
            background-image: ${BUBBLE_BLOCK_B_DESKTOP};
          }
        }
      `}</style>
    </div>
  );
}
