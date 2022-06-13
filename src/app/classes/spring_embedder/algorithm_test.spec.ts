import {Vector} from './models/vector';
import { Edge } from './models/edge';
import {FRSpringEmbedder} from './algorithmn';

describe('SpringEmbedder Test', () => {
    let points: Array<Vector> = [];
    let edges: Array<Edge> = [];
    it('Basic test', () => {
        // The algorithm can be executed without crashing. Not the best test,
        // but so far I can't think of a better one. Please let me know if
        // you found one.
        points = [
            new Vector(0, 0),
            new Vector(0, 1),
            new Vector(1, 1),
            new Vector(1, 0)
        ];
        edges = [
            new Edge(
                new Vector(0, 0),
                new Vector(1, 1)
            ),
            new Edge(
                new Vector(0, 1),
                new Vector(1, 0)
            )
        ];
        const embedder = new FRSpringEmbedder(
            points,
            edges
        );
        embedder.embedd(10, 0.1);
        console.log('Points after embedding:');
        for (const p of points) {
            console.log(`Point: x: ${p.x}, y: ${p.y}`)
        }
        expect(true).toBeTruthy();
    });
});
