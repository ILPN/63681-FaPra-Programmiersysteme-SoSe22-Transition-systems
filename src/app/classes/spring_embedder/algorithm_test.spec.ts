import {Point} from './models/point';
import { Edge } from './models/edge';
import {FRSpringEmbedder} from './algorithmn';

describe('SpringEmbedder Test', () => {
    let points: Array<Point> = [];
    let edges: Array<Edge> = [];
    it('Basic test', () => {
        // The algorithm can be executed without crashing. Not the best test,
        // but so far I can't think of a better one. Please let me know if
        // you found one.
        points = [
            new Point(0, 0),
            new Point(0, 1),
            new Point(1, 1),
            new Point(1, 0)
        ];
        edges = [
            new Edge(
                new Point(0, 0),
                new Point(1, 1)
            ),
            new Edge(
                new Point(0, 1),
                new Point(1, 0)
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