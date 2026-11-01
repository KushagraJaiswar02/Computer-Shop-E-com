import React from 'react';
import { Link } from 'react-router-dom';
import { brandConfig } from '../../../config/brand';
export const BrandLogo: React.FC = () => <Link to="/" aria-label={`${brandConfig.shopName} home`} className="shop-logo"><img src={brandConfig.logoPath} alt={brandConfig.logoAlt} width={40} height={40} /><span><strong>{brandConfig.shopName}</strong><small>{brandConfig.tagline}</small></span></Link>;
