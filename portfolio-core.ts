/**
 * ============================================================================
 * ENG. IBRAHIM FATHY PORTFOLIO - CORE ENGINE (TYPESCRIPT)
 * Provides type-safe portfolio state management, advanced DOM interaction,
 * custom event dispatchers, and WebGL dynamic configurations.
 * ============================================================================
 */

// 1. Interfaces & Type Declarations
export interface PortfolioConfig {
    theme: 'dark-mode' | 'light-mode';
    activeSection: string;
    animationSpeed: 'fast' | 'normal' | 'slow';
    interactiveBg: boolean;
}

export interface SkillCardData {
    id: string;
    title: string;
    category: 'web' | 'mobile' | 'desktop' | 'security' | 'ai' | 'automation';
    proficiency: number; // 0 to 100
}

export type ThemeChangeListener = (newTheme: 'dark-mode' | 'light-mode') => void;

// 2. State Management Class
export class PortfolioEngine {
    private config: PortfolioConfig;
    private listeners: Set<ThemeChangeListener> = new Set();
    private skillsRegistry: Map<string, SkillCardData> = new Map();

    constructor(initialConfig?: Partial<PortfolioConfig>) {
        this.config = {
            theme: (localStorage.getItem("portfolio-theme") as 'dark-mode' | 'light-mode') || 'dark-mode',
            activeSection: 'hero',
            animationSpeed: 'normal',
            interactiveBg: true,
            ...initialConfig
        };
        
        this.init();
    }

    private init(): void {
        console.log("%c[Eng. Ibrahim Fathy]%c Engine Initialized successfully in TypeScript mode.", 
            "color: #ff6a00; font-weight: bold; font-size: 1.2rem;", 
            "color: #cbd5e1; font-size: 1rem;");
        this.applyTheme(this.config.theme);
    }

    // Theme Management
    public getTheme(): 'dark-mode' | 'light-mode' {
        return this.config.theme;
    }

    public toggleTheme(): void {
        const targetTheme: 'dark-mode' | 'light-mode' = 
            this.config.theme === 'dark-mode' ? 'light-mode' : 'dark-mode';
        
        this.config.theme = targetTheme;
        localStorage.setItem("portfolio-theme", targetTheme);
        this.applyTheme(targetTheme);
        this.notifyThemeListeners(targetTheme);
    }

    private applyTheme(theme: 'dark-mode' | 'light-mode'): void {
        const body = document.body;
        if (theme === 'light-mode') {
            body.classList.replace('dark-mode', 'light-mode');
        } else {
            body.classList.replace('light-mode', 'dark-mode');
        }
    }

    public onThemeChange(listener: ThemeChangeListener): () => void {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    private notifyThemeListeners(theme: 'dark-mode' | 'light-mode'): void {
        this.listeners.forEach(listener => listener(theme));
    }

    // Skills Matrix Integration
    public registerSkill(skill: SkillCardData): void {
        this.skillsRegistry.set(skill.id, skill);
    }

    public getSkillsByCategory(category: SkillCardData['category']): SkillCardData[] {
        return Array.from(this.skillsRegistry.values())
            .filter(skill => skill.category === category);
    }

    // Generic Event Logging for Analytics/Security Audit
    public auditLog(event: string, meta?: Record<string, unknown>): void {
        const timestamp = new Date().toISOString();
        const payload = {
            event,
            timestamp,
            userSessionActive: true,
            meta: meta || {}
        };
        // Securely logs page health, system triggers, or interaction milestones
        console.info(`[Audit-Log][${timestamp}] - Event: ${event}`, payload);
    }
}

// 3. Custom Hover Effect Class (Generics & DOM Type Safety)
export class DOMInteractionEngine<T extends HTMLElement> {
    private elements: NodeListOf<T>;

    constructor(selector: string) {
        this.elements = document.querySelectorAll(selector) as NodeListOf<T>;
    }

    // Safe implementation of 3D parallax offsets using TypeScript
    public enableInteractiveParallax(maxRotationDegrees: number = 10): void {
        this.elements.forEach(element => {
            element.addEventListener('mousemove', (event: MouseEvent) => {
                const rect = element.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = ((y - centerY) / centerY) * -maxRotationDegrees;
                const rotateY = ((x - centerX) / centerX) * maxRotationDegrees;
                
                element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });

            element.addEventListener('mouseleave', () => {
                element.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
                element.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            });
        });
    }
}
