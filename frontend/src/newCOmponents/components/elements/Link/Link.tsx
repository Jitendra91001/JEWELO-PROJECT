import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useTheme } from '../../../contexts/Theme/Theme.context';

interface DynamicLinkProps {
    to: string;
    pathParams?: (string | number)[];
    queryParams?: Record<string, string | number>;
    children: React.ReactNode;
}

type QueryParams = Record<string, string | number>;

const DynamicLink: React.FC<DynamicLinkProps> = ({ to, pathParams, queryParams, children }) => {
    const { Color } = useTheme();
    
    
    const buildQueryString = (params: QueryParams): string => {
        const queryString = Object.entries(params)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&');

        return queryString ? `?${queryString}` : '';
    };

    const formattedPathParams = pathParams?.map(param => String(param));
    const pathParamsString = formattedPathParams?.join('/') || '';

    const targetUrl = `${to}/${pathParamsString}${buildQueryString(queryParams || {})}`;

    const linkStyle = {
        color: Color['--linkColor'],
        textDecoration: 'underline',
    };

    return (
        <RouterLink to={targetUrl} style={linkStyle}>
            {children}
        </RouterLink>
    );
};

export default DynamicLink;
