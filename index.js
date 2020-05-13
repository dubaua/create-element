const SVG_TAGS = [
  'circle',
  'clipPath',
  'defs',
  'desc',
  'ellipse',
  'g',
  'image',
  'line',
  'linearGradient',
  'marker',
  'mask',
  'path',
  'pattern',
  'polygon',
  'polyline',
  'radialGradient',
  'rect',
  'stop',
  'svg',
  'switch',
  'symbol',
  'text',
  'textPath',
  'title',
  'tspan',
  'use',
];

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

const NAMESPACED_ATTRIBUTES = {
  'xlink:href': 'http://www.w3.org/1999/xlink',
};

function bindReference(target, key, link) {
  if (!link) {
    return bindReference.bind(this, target, key);
  }
  target[key] = link;
}

/**
 * Creates a node with given parameters
 * @param {string} tagAndClass - tag and optional dot separated classnames
 * @param {Object} [options={}] - options
 * @param {Array|String} children - children or string
 * @return {*} a node
 */

function createElement(tagAndClass, { style, listeners, attributes, ref, domProps, dataset } = {}, children) {
  // extract classlist from tag name
  const [tagName, ...classList] = tagAndClass.split('.');

  // create element by tagName
  const nodeElement =
    SVG_TAGS.indexOf(tagName) !== -1
      ? document.createElementNS(SVG_NAMESPACE, tagName)
      : document.createElement(tagName);

  // add classes
  if (classList.length) {
    classList.forEach(className => nodeElement.classList.add(className));
  }

  // set attributes by key
  if (attributes) {
    for (const key in attributes) {
      var attr = attributes[key];
      if (attr) {
        if (NAMESPACED_ATTRIBUTES.hasOwnProperty(key)) {
          nodeElement.setAttributeNS(NAMESPACED_ATTRIBUTES[key], key, attr);
        } else {
          nodeElement.setAttribute(key, attr);
        }
      }
    }
  }

  // assign dom props
  if (domProps) {
    for (const key in domProps) {
      nodeElement[key] = domProps[key];
    }
  }

  // assign styles
  if (style) {
    for (const key in style) {
      nodeElement.style[key] = style[key];
    }
  }

  // bind listeners
  if (listeners) {
    for (const key in listeners) {
      nodeElement.addEventListener(key, listeners[key], false);
    }
  }

  // create childs
  if (children) {
    if (Array.isArray(children)) {
      children.forEach(child => {
        if (child) {
          child instanceof Element ? nodeElement.appendChild(child) : nodeElement.appendChild(create(...child));
        }
      });
    } else if (typeof children === 'string') {
      const textnode = document.createTextNode(children);
      nodeElement.appendChild(textnode);
    }
  }

  // bind rel
  if (ref) {
    ref(nodeElement);
  }

  // assign dataset
  if (dataset) {
    for (const key in dataset) {
      nodeElement.dataset[key] = dataset[key];
    }
  }

  return nodeElement;
}

module.exports = createElement;
