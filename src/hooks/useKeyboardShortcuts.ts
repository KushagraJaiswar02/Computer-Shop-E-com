import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export const useKeyboardShortcuts = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    focusSearch,
    setIsNavWheelOpen,
    isNavWheelOpen,
    setIsCartOpen,
    isCartOpen,
    isShortcutsModalOpen,
    setIsShortcutsModalOpen,
    focusedProductId,
    toggleWishlist,
  } = useStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Do not trigger shortcuts when typing inside form elements
      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable);

      // Escape always works to close modals/menus even inside inputs
      if (e.key === 'Escape') {
        if (isShortcutsModalOpen) {
          setIsShortcutsModalOpen(false);
          e.preventDefault();
          return;
        }
        if (isCartOpen) {
          setIsCartOpen(false);
          e.preventDefault();
          return;
        }
        if (isNavWheelOpen) {
          setIsNavWheelOpen(false);
          e.preventDefault();
          return;
        }
        if (isInput) {
          (target as HTMLElement).blur();
          return;
        }
      }

      // Let open overlays own their keyboard interaction; Escape above remains global.
      if (isShortcutsModalOpen || isCartOpen || isNavWheelOpen) return;

      if (isInput) {
        return;
      }

      // Modifier key guards: ignore if Ctrl, Alt, Meta are pressed (e.g. browser Cmd+W, Ctrl+K)
      if (e.ctrlKey || e.altKey || e.metaKey) {
        return;
      }

      switch (e.key) {
        case '/': {
          e.preventDefault();
          focusSearch();
          break;
        }
        case 'c':
        case 'C': {
          e.preventDefault();
          setIsNavWheelOpen(prev => !prev);
          break;
        }
        case 'w':
        case 'W': {
          e.preventDefault();
          navigate('/wishlist');
          break;
        }
        case 'k':
        case 'K': {
          e.preventDefault();
          setIsCartOpen(prev => !prev);
          break;
        }
        case '?': {
          e.preventDefault();
          setIsShortcutsModalOpen(prev => !prev);
          break;
        }
        case 'l':
        case 'L': {
          if (focusedProductId) {
            e.preventDefault();
            toggleWishlist(focusedProductId);
          }
          break;
        }
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    focusSearch,
    setIsNavWheelOpen,
    isNavWheelOpen,
    setIsCartOpen,
    isCartOpen,
    isShortcutsModalOpen,
    setIsShortcutsModalOpen,
    focusedProductId,
    toggleWishlist,
    navigate,
    location.pathname,
    location.search,
  ]);
};
