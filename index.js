const { NodeType } = require('@tensorify/types');

/**
 * PyTorch Conv2d Layer Node
 */
class PTConv2d {
  constructor() {
    this.name = 'PyTorch Conv2d Layer';
    this.nodeType = NodeType.LAYER;
    this.description = 'PyTorch 2D convolutional layer';
    
    // Define inputs and outputs for canvas connections
    this.inputs = [
      {
        name: 'input_tensor',
        type: 'tensor',
        required: false,
        description: 'Input tensor (optional for layer definition)'
      }
    ];
    
    this.outputs = [
      {
        name: 'layer',
        type: 'layer',
        description: 'Configured Conv2d layer'
      },
      {
        name: 'output_tensor',
        type: 'tensor',
        description: 'Output tensor after convolution'
      }
    ];
    
    this.schema = {
      type: 'object',
      properties: {
        variableName: {
          type: 'string',
          default: 'conv2d_layer',
          description: 'Variable name for the Conv2d layer',
          required: true
        },
        inChannels: {
          type: 'number',
          default: 3,
          description: 'Number of input channels'
        },
        outChannels: {
          type: 'number',
          default: 64,
          description: 'Number of output channels'
        },
        kernelSize: {
          type: 'number',
          default: 3,
          description: 'Size of the convolving kernel'
        },
        stride: {
          type: 'number',
          default: 1,
          description: 'Stride of the convolution'
        },
        padding: {
          type: 'number',
          default: 1,
          description: 'Zero-padding added to both sides of the input'
        },
        dilation: {
          type: 'number',
          default: 1,
          description: 'Spacing between kernel elements'
        },
        groups: {
          type: 'number',
          default: 1,
          description: 'Number of blocked connections from input channels to output channels'
        },
        bias: {
          type: 'boolean',
          default: true,
          description: 'Whether to add a learnable bias to the output'
        }
      },
      required: ['variableName', 'inChannels', 'outChannels', 'kernelSize']
    };

    this.codeGeneration = {
      generateCode: (settings, context) => {
        const varName = settings.variableName || 'conv2d_layer';
        const inChannels = settings.inChannels || 3;
        const outChannels = settings.outChannels || 64;
        const kernelSize = settings.kernelSize || 3;
        const stride = settings.stride || 1;
        const padding = settings.padding || 1;
        const dilation = settings.dilation || 1;
        const groups = settings.groups || 1;
        const bias = settings.bias !== false;

        const instantiation = `self.${varName} = nn.Conv2d(
    in_channels=${inChannels},
    out_channels=${outChannels},
    kernel_size=${kernelSize},
    stride=${stride},
    padding=${padding},
    dilation=${dilation},
    groups=${groups},
    bias=${bias ? 'True' : 'False'}
)`;

        return {
          imports: ['torch.nn as nn'],
          definitions: [],
          instantiations: [instantiation],
          usage: {
            forward: `x = self.${varName}(x)`,
            parameters: `# Conv2d: ${inChannels} -> ${outChannels} channels, kernel=${kernelSize}`,
            named_parameters: `('${varName}', self.${varName})`
          }
        };
      },

      getDependencies: (settings) => [],
      getOutputs: (settings) => [`conv2d_${settings.variableName || 'layer'}`],
      validateConnections: (sourceOutputs, targetInputs) => {
        // PTConv2d can connect to anything - it's a layer/model component
        return true;
      }
    };

    this.security = {
      allowedImports: ['torch', 'torch.nn'],
      maxExecutionTime: 5000,
      memoryLimit: 1024 * 1024 * 50,
      sandbox: true
    };

    this.quality = {
      testCoverage: 0.90,
      documentation: 'PyTorch 2D convolutional layer for feature extraction',
      version: '1.0.0',
      examples: [
        'Basic conv2d layer with 3x3 kernel',
        'Feature extraction with 64 output channels',
        'Custom conv2d with stride and padding configuration'
      ]
    };
  }
}

module.exports = PTConv2d; 