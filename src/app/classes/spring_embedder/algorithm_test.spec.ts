import {Vector} from './models/vector';
import {TsNode} from '../diagram/tsnode';
import {TsEdge} from '../diagram/tsedge';
import {FRSpringEmbedder} from './algorithmn';

describe('SpringEmbedder Test', () => {
    let points: Array<TsNode> = [];
    let edges: Array<TsEdge> = [];
    it('Basic test', () => {
        // The algorithm can be executed without crashing. Not the best test,
        // but so far I can't think of a better one. Please let me know if
        // you found one.
        points = [
            new TsNode('1', 'Node 1'),
            new TsNode('2', 'Node 2'),
            new TsNode('3', 'Node 3'),
            new TsNode('4', 'Node 4')
        ];
        edges = [
            new TsEdge(
                '1',
                'Edge 1',
                1,
                new TsNode('1', 'Node 1'),
                new TsNode('2', 'Node 2'),
            ),
            new TsEdge(
                '2',
                'Edge 2',
                1,
                new TsNode('2', 'Node 2'),
                new TsNode('3', 'Node 3'),
            ),
            new TsEdge(
                '3',
                'Edge 3',
                1,
                new TsNode('3', 'Node 3'),
                new TsNode('4', 'Node 4')
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
