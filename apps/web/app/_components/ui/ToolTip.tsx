'use client';

import {
  ReactNode,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

import styles from '@/styles/components/tooltip.module.css';

interface Props {
  open: boolean;
  targetRef: React.RefObject<HTMLElement | null>;
  children: ReactNode;
  onClose?: () => void;
}

export default function Tooltip({
  open,
  targetRef,
  children,
  onClose,
}: Props) {
  const [style, setStyle] = useState({
    top: 0,
    left: 0,
  });

  const [placement, setPlacement] = useState<'top' | 'bottom'>(
    'bottom'
  );

  useLayoutEffect(() => {
    if (!open || !targetRef.current) return;

    const target = targetRef.current;

    const rect = target.getBoundingClientRect();

    const tooltipWidth = Math.min(window.innerWidth - 32, 300);

    const tooltipHeight = 120;

    const spaceBottom =
      window.innerHeight - rect.bottom;

    const showTop = spaceBottom < tooltipHeight + 20;

    const top = showTop
      ? rect.top + window.scrollY - 12
      : rect.bottom + window.scrollY + 12;

    const left = Math.min(
      window.innerWidth - tooltipWidth - 16,
      Math.max(
        16,
        rect.left +
          window.scrollX +
          rect.width / 2 -
          tooltipWidth / 2
      )
    );

    setPlacement(showTop ? 'top' : 'bottom');

    setStyle({
      top,
      left,
    });
  }, [open, targetRef]);

  useEffect(() => {
    if (!open) return;

    const update = () => {
      if (!targetRef.current) return;

      const rect =
        targetRef.current.getBoundingClientRect();

      const tooltipWidth = Math.min(
        window.innerWidth - 32,
        300
      );

      const tooltipHeight = 120;

      const spaceBottom =
        window.innerHeight - rect.bottom;

      const showTop =
        spaceBottom < tooltipHeight + 20;

      setPlacement(showTop ? 'top' : 'bottom');

      setStyle({
        top: showTop
          ? rect.top +
            window.scrollY -
            12
          : rect.bottom +
            window.scrollY +
            12,

        left: Math.min(
          window.innerWidth -
            tooltipWidth -
            16,
          Math.max(
            16,
            rect.left +
              window.scrollX +
              rect.width / 2 -
              tooltipWidth / 2
          )
        ),
      });
    };

    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);

    return () => {
      window.removeEventListener(
        'scroll',
        update,
        true
      );
      window.removeEventListener(
        'resize',
        update
      );
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <>
      <div
        className={styles.backdrop}
        onClick={onClose}
      />

      <div
        className={`${styles.tooltip} ${
          placement === 'top'
            ? styles.top
            : styles.bottom
        }`}
        style={style}
      >
        {children}
      </div>
    </>,
    document.body
  );
}