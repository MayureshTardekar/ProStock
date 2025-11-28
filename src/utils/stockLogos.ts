// Stock logo utility using Clearbit API (Free, reliable)

const LOGO_DOMAINS: Record<string, string> = {
    'RELIANCE': 'ril.com',
    'TCS': 'tcs.com',
    'HDFCBANK': 'hdfcbank.com',
    'INFY': 'infosys.com',
    'ICICIBANK': 'icicibank.com',
    'HINDUNILVR': 'hul.co.in',
    'ITC': 'itcportal.com',
    'SBIN': 'sbi.co.in',
    'BHARTIARTL': 'airtel.in',
    'KOTAKBANK': 'kotak.com',
    'LT': 'larsentoubro.com',
    'BAJFINANCE': 'bajajfinserv.in',
    'HCLTECH': 'hcltech.com',
    'WIPRO': 'wipro.com',
    'MARUTI': 'marutisuzuki.com',
    'SUNPHARMA': 'sunpharma.com',
    'AXISBANK': 'axisbank.com',
    'TITAN': 'titan.co.in',
    'ASIANPAINT': 'asianpaints.com',
    'NESTLEIND': 'nestle.in',
};

/**
 * Get company logo URL using Clearbit API
 * Falls back to placeholder if logo not available
 * 
 * @param symbol - Stock symbol (e.g., 'RELIANCE.NS' or 'RELIANCE')
 * @returns Logo URL or placeholder
 */
export const getStockLogo = (symbol: string): string => {
    const cleanSymbol = symbol.replace('.NS', '').toUpperCase();
    const domain = LOGO_DOMAINS[cleanSymbol];

    if (domain) {
        return `https://logo.clearbit.com/${domain}`;
    }

    // Fallback: return empty string to use placeholder
    return '';
};

/**
 * Get stock symbol's first letter for placeholder
 */
export const getStockInitial = (symbol: string): string => {
    const cleanSymbol = symbol.replace('.NS', '');
    return cleanSymbol.charAt(0).toUpperCase();
};
