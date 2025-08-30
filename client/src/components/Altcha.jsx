import React, { useEffect, forwardRef } from 'react';

const Altcha = forwardRef(({ onVerified, challengeUrl }, ref) => {
    useEffect(() => {
        const currentRef = ref.current;
        const handleVerified = (event) => {
            if (onVerified) {
                onVerified(event);
            }
        };

        if (currentRef) {
            currentRef.addEventListener('verified', handleVerified);
        }

        return () => {
            if (currentRef) {
                currentRef.removeEventListener('verified', handleVerified);
            }
        };
    }, [onVerified, ref]);

    return (
        <altcha-widget style={{ '--altcha-max-width': '100%', }} ref={ref} challengeUrl={challengeUrl} />
    );
});

export default Altcha;
