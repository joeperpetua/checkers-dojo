import  { useState } from "react";
import { SDK, createDojoStore } from "@dojoengine/sdk";
import BackgroundCheckers from "../assets/BackgrounCheckers.png";
import Board from "../assets/Board.png";
import PieceBlack from "../assets/PieceBlack.svg";
import PieceOrange from "../assets/PieceOrange.svg";
import Player1 from "../assets/Player1.png";
import Player2 from "../assets/Player1.png";
import GameOver from "../components/GameOver";
import Winner from "../components/Winner";
import { schema } from "../bindings.ts";
import { useDojo } from "../hooks/useDojo.tsx";

// Crea el store de Dojo
export const useDojoStore = createDojoStore<typeof schema>();

function Checker({ sdk }: { sdk: SDK<typeof schema> }) {
  const [arePiecesVisible] = useState(true);
  const [isGameOver] = useState(false);
  const [isWinner] = useState(false);
  const [selectedPieceId, setSelectedPieceId] = useState<number | null>(null);
  const [validMoves, setValidMoves] = useState<Position[]>([]);

  const {
    account,
    setup: { setupWorld },
  } = useDojo();

  // Definición de las posiciones iniciales de las piezas
  interface Position {
    row: number;
    col: number;
  }

  interface Piece {
    id: number;
    color: string;
    position: Position;
  }

  const initialBlackPieces: Piece[] = [
    { id: 1, color: "black", position: { row: 0, col: 1 } },
    { id: 2, color: "black", position: { row: 0, col: 3 } },
    { id: 3, color: "black", position: { row: 0, col: 5 } },
    { id: 4, color: "black", position: { row: 0, col: 7 } },
    { id: 5, color: "black", position: { row: 1, col: 0 } },
    { id: 6, color: "black", position: { row: 1, col: 2 } },
    { id: 7, color: "black", position: { row: 1, col: 4 } },
    { id: 8, color: "black", position: { row: 1, col: 6 } },
    { id: 9, color: "black", position: { row: 2, col: 1 } },
    { id: 10, color: "black", position: { row: 2, col: 3 } },
    { id: 11, color: "black", position: { row: 2, col: 5 } },
    { id: 12, color: "black", position: { row: 2, col: 7 } },
  ];

  const initialOrangePieces: Piece[] = [
    { id: 13, color: "orange", position: { row: 5, col: 0 } },
    { id: 14, color: "orange", position: { row: 5, col: 2 } },
    { id: 15, color: "orange", position: { row: 5, col: 4 } },
    { id: 16, color: "orange", position: { row: 5, col: 6 } },
    { id: 17, color: "orange", position: { row: 6, col: 1 } },
    { id: 18, color: "orange", position: { row: 6, col: 3 } },
    { id: 19, color: "orange", position: { row: 6, col: 5 } },
    { id: 20, color: "orange", position: { row: 6, col: 7 } },
    { id: 21, color: "orange", position: { row: 7, col: 0 } },
    { id: 22, color: "orange", position: { row: 7, col: 2 } },
    { id: 23, color: "orange", position: { row: 7, col: 4 } },
    { id: 24, color: "orange", position: { row: 7, col: 6 } },
  ];

  const [blackPieces, setBlackPieces] = useState<Piece[]>(initialBlackPieces);
  const [orangePieces, setOrangePieces] = useState<Piece[]>(initialOrangePieces);
  
  const cellSize = 88;

  const handlePieceClick = (piece: Piece) => {
    const pieceId = piece.id;
    console.log("Selected piece ID:", pieceId);

    if (selectedPieceId === pieceId) {
      setSelectedPieceId(null);
      setValidMoves([]);
    } else {
      setSelectedPieceId(pieceId);
      const moves = calculateValidMoves(piece);
      console.log("Valid moves for piece", pieceId, ":", moves);
      setValidMoves(moves); 
    }
  };

  const calculateValidMoves = (piece: Piece): Position[] => {
    const moves: Position[] = [];
    const { row, col } = piece.position;

    if (piece.color === "black") {
      if (row + 1 < 8) {
        if (col - 1 >= 0) moves.push({ row: row + 1, col: col - 1 });
        if (col + 1 < 8) moves.push({ row: row + 1, col: col + 1 });
      }
    } else {
      if (row - 1 >= 0) {
        if (col - 1 >= 0) moves.push({ row: row - 1, col: col - 1 });
        if (col + 1 < 8) moves.push({ row: row - 1, col: col + 1 });
      }
    }

    return moves;
  };


  const movePiece = (move: Position) => {
    if (selectedPieceId !== null) {
      const selectedPiece = [...blackPieces, ...orangePieces].find(piece => piece.id === selectedPieceId);

      if (selectedPiece) {
        const updatedPieces = (selectedPiece.color === "black" ? blackPieces : orangePieces).map(piece => {
          if (piece.id === selectedPieceId) {
            return { ...piece, position: move };
          }
          return piece;
        });

        if (selectedPiece.color === "black") {
          setBlackPieces(updatedPieces);
        } else {
          setOrangePieces(updatedPieces);
        }

        setSelectedPieceId(null);
        setValidMoves([]);
      }
    }
  };

  const renderPieces = () => (
    <>
      {blackPieces.map((piece) => (
        <img
          key={piece.id}
          src={PieceBlack}
          alt={`${piece.color} piece`}
          className="absolute"
          style={{
            left: `${piece.position.col * cellSize + 63}px`,
            top: `${piece.position.row * cellSize + 65}px`,
            cursor: "pointer",
            width: "60px",
            height: "60px",
            border: selectedPieceId === piece.id ? "2px solid yellow" : "none",
          }}
          onClick={() => handlePieceClick(piece)}
        />
      ))}
      {orangePieces.map((piece) => (
        <img
          key={piece.id}
          src={PieceOrange}
          alt={`${piece.color} piece`}
          className="absolute"
          style={{
            left: `${piece.position.col * cellSize + 63}px`,
            top: `${piece.position.row * cellSize + 55}px`,
            cursor: "pointer",
            width: "60px",
            height: "60px",
            border: selectedPieceId === piece.id ? "2px solid yellow" : "none",
          }}
          onClick={() => handlePieceClick(piece)}
        />
      ))}
      {validMoves.map((move, index) => (
        <div
          key={index}
          className="absolute border border-green-500"
          style={{
            left: `${move.col * cellSize + 63}px`,
            top: `${move.row * cellSize + 58}px`,
            width: "60px",
            height: "60px",
            cursor: "pointer",
            backgroundColor: "rgba(0, 255, 0, 0.5)", 
          }}
          onClick={() => movePiece(move)} 
        />
      ))}
    </>
  );

  return (
    <div
      className="relative h-screen w-full"
      style={{
        backgroundImage: `url(${BackgroundCheckers})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {isGameOver && <GameOver />}
      {isWinner && <Winner />}
      <img src={Player1} alt="Player 1" className="fixed" style={{ top: "100px", left: "80px", width: "400px" }} />
      <img src={Player2} alt="Player 2" className="fixed" style={{ top: "770px", right: "80px", width: "400px" }} />
      <div className="flex items-center justify-center h-full">
        <div className="relative">
          <img src={Board} alt="Board" className="w-[800px] h-[800px] object-contain" />
          {arePiecesVisible && renderPieces()}
        </div>
      </div>
    </div>
  );
}

export default Checker;
