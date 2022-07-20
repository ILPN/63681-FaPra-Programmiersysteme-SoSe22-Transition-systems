import { Injectable } from '@angular/core';

import { TsModel } from '../classes/diagram/tsmodel';
import { TsEdge } from '../classes/diagram/tsedge';
import { TsNode } from '../classes/diagram/tsnode';
import { Vector } from '../classes/spring_embedder/models/vector';

interface PNMLPlace {
    id:             string,
    name:           string,
    initialMarking: string
    position:       Vector
}

interface PNMLTransition {
    id:   string
    name: string,
    position: Vector
}

interface PNMLArc {
    id:     string,
    source: string,
    target: string
}

interface Edge {
    from: string,
    to:   string,
    name: string
}

@Injectable({
    providedIn: 'root'
})
export class PNMLService {

    private parser = new DOMParser();

    constructor() { }

    public parsePlaces(places: HTMLCollectionOf<Element>): PNMLPlace[] {
        const parsedPlaces: PNMLPlace[] = []
        for (let i = 0; i < places.length; i++) {
            const place = places[i];
            const name = place.getElementsByTagName('name')[0].textContent?.trim();
            const initialMarking = place.getElementsByTagName('initialMarking')[0].textContent?.trim();
            const position = place.getElementsByTagName('position')[0]
            const positionX = position.getAttribute('x')?.trim();
            const positionY = position.getAttribute('y')?.trim();
            parsedPlaces.push({
                id: place.getAttribute('id') || '',
                name: name || '',
                initialMarking: initialMarking || '',
                position: new Vector(
                    parseInt(positionX || '0'),
                    parseInt(positionY || '0')
                )
            });
        }
        return parsedPlaces;
    }

    public parseTransitions(transitions: HTMLCollectionOf<Element>): PNMLTransition[] {
        const parsedTransitions: PNMLTransition[] = [];
        for (let i = 0; i < transitions.length; i++) {
            const trans = transitions[i];
            const name = trans.getElementsByTagName('name')[0].textContent?.trim();
            const position = trans.getElementsByTagName('position')[0]
            const positionX = position.getAttribute('x')?.trim();
            const positionY = position.getAttribute('y')?.trim();

            parsedTransitions.push({
                id: trans.getAttribute('id') || '',
                name: name || '',
                position: new Vector(
                    parseInt(positionX || '0'),
                    parseInt(positionY || '0')
                )
            });
        }
        return parsedTransitions;
    }

    public parseArcs(arcs: HTMLCollectionOf<Element>): PNMLArc[] {
        const parsedArcs: PNMLArc[] = [];
        for (let i = 0; i < arcs.length; i++) {
            const arc = arcs[i];
            parsedArcs.push({
                id:     arc.getAttribute('id') || '',
                source: arc.getAttribute('source') || '',
                target: arc.getAttribute('target') || ''
            });
        }
        return parsedArcs;
    }

    import(pnml_str: string): TsModel {
        // Extract fragments for parsing from the XML data
        pnml_str = pnml_str.trim();
        const xmlDoc = this.parser.parseFromString(pnml_str, 'text/xml');
        const xmlPlaces = xmlDoc.getElementsByTagName('place');
        const xmlTransitions = xmlDoc.getElementsByTagName('transition');
        const xmlArcs = xmlDoc.getElementsByTagName('arc')

        // Parse the extracted data
        const places: PNMLPlace[] = this.parsePlaces(xmlPlaces);
        const transitions: PNMLTransition[] = this.parseTransitions(xmlTransitions);
        const arcs: PNMLArc[] = this.parseArcs(xmlArcs);

        // Mapps the Id of an element to its type
        const idToType: Record<string, string> = {}
        // fill the map
        places.forEach(place => {
            idToType[place.id] = 'place'
        });
        transitions.forEach(trans => {
            idToType[trans.id] = 'transition'
        });

        const fromNodes = arcs.filter(arc => {
            return idToType[arc.source] === 'place';
        });

        const toNode = arcs.filter(arc => {
            return idToType[arc.source] === 'transition';
        });

        // Merge the arcs
        // First collect the start nodes and the label of the transition
        const edges: Edge[] = [];
        fromNodes.forEach(pnmlArc => {
            const transition = transitions.filter(trans => {
                return trans.id === pnmlArc.target;
            });
            edges.push({
                from: pnmlArc.source,
                to: pnmlArc.target,
                name: transition[0].name
            });
        });

        // Then add the from node
        toNode.forEach(pnmlArc => {
            const foundEdges = edges.filter(edge => {
                return edge.to === pnmlArc.source;
            });
            const edge = foundEdges[0];
            edge.to = pnmlArc.target;
        });

        // Fill the parsed data into our model
        const model = new TsModel();
        // Add the nodes
        places.forEach(place => {
            const node = new TsNode(place.id, place.name);
            node.position = place.position;
            model.addNode(node);
        });

        for (const edge of edges) {
            const fromNode = model.nodes.filter(node => node.id === edge.from)[0];
            const toNode = model.nodes.filter(node => node.id === edge.to)[0];
            model.addEdge(
                new TsEdge(
                    'id',    // Find a better string to put here
                    edge.name,
                    1.0,   // I din't know what to put here
                    fromNode,
                    toNode
                )
            );
        }

        return model;
    }
}
