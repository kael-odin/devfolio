import type { ComponentType } from "react";
import { lazy } from "react";

// Screenshot covers (deployed projects) -- 960x600 webp captured from the live sites
// template: removed personal screenshot gitscope.webp
// template: removed personal screenshot ledger-sync.webp
// template: removed personal screenshot leetcode-rating-predictor.webp
// template: removed personal screenshot instagram-likes-leaderboard.webp
// template: removed personal screenshot portfolio-react.webp
// template: removed personal screenshot code-arena.webp
// template: removed personal screenshot leetcode-among-us.webp
// template: removed personal screenshot noobathon.webp
// template: removed personal screenshot financial-dashboard.webp
// template: removed personal screenshot ai-code-translator.webp
// template: removed personal screenshot contact-manager.webp
// template: removed personal screenshot music-web-app.webp
// template: removed personal screenshot claude-cost-optimizer.webp
// template: removed personal screenshot kalchar.webp
// template: removed personal screenshot sagas.webp

interface SceneCoverProps {
   tint: string;
   variant?: string;
}

type SceneComponent = ComponentType<SceneCoverProps>;

// Animated SVG scenes (undeployed projects) -- lazy so the Projects chunk
// stays lean; they only load when the section renders.
const InfraScene = lazy(() => import("./InfraScene"));
// template: unused by placeholder covers (re-enable when you add projects)
// const McpScene = lazy(() => import("./McpScene"));
const MlScene = lazy(() => import("./MlScene"));
// template: unused by placeholder covers (re-enable when you add projects)
// const MlopsScene = lazy(() => import("./MlopsScene"));
// template: unused by placeholder covers (re-enable when you add projects)
// const GraphScene = lazy(() => import("./GraphScene"));
const GameScene = lazy(() => import("./GameScene"));
const DocsScene = lazy(() => import("./DocsScene"));
// template: unused by placeholder covers (re-enable when you add projects)
// const AutomationScene = lazy(() => import("./AutomationScene"));
// template: unused by placeholder covers (re-enable when you add projects)
// const AuthScene = lazy(() => import("./AuthScene"));
const WebAppScene = lazy(() => import("./WebAppScene"));
// template: unused by placeholder covers (re-enable when you add projects)
// const GateScene = lazy(() => import("./GateScene"));
// template: unused by placeholder covers (re-enable when you add projects)
// const TaxScene = lazy(() => import("./TaxScene"));
// template: unused by placeholder covers (re-enable when you add projects)
// const PluginScene = lazy(() => import("./PluginScene"));
// template: unused by placeholder covers (re-enable when you add projects)
// const GuideScene = lazy(() => import("./GuideScene"));

export type ProjectCover =
   | { kind: "image"; src: string }
   | { kind: "scene"; Scene: SceneComponent; variant?: string };

/**
 * Cover per project id (ids from data/projects.json).
 * Deployed -> live screenshot. Not deployed -> themed animated scene.
 */
const COVER_BY_ID: Record<number, ProjectCover> = {
   // Template placeholders: every scene below is a built-in animated SVG
   // scene, so the template ships zero personal screenshots.
   1: { kind: "scene", Scene: WebAppScene, variant: "contacts" }, // Your Flagship Project
   2: { kind: "scene", Scene: InfraScene, variant: "pipeline" }, // Your Second Showcase Project
   3: { kind: "scene", Scene: WebAppScene, variant: "social" }, // A Team Project You Contributed To
   4: { kind: "scene", Scene: MlScene }, // Another Side Project
   5: { kind: "scene", Scene: GameScene, variant: "snake" }, // One More Experiment
   6: { kind: "scene", Scene: DocsScene, variant: "list" }, // Your Open-Source Tool or Guide
};

export const getProjectCover = (
   id: number,
   _title: string,
): ProjectCover | undefined => COVER_BY_ID[id];
