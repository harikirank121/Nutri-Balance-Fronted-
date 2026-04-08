export const fadeSlideUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut"
        }
    }
};

export const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

export const hoverLift = {
    hover: {
        y: -5,
        boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
        transition: {
            duration: 0.2,
            ease: "easeInOut"
        }
    }
};

export const pageTransition = {
    hidden: { opacity: 0, x: -20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.4,
            ease: "easeOut"
        }
    },
    exit: {
        opacity: 0,
        x: 20,
        transition: {
            duration: 0.3,
            ease: "easeIn"
        }
    }
};
