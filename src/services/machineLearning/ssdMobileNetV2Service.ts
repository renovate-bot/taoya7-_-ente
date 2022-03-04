import * as tf from '@tensorflow/tfjs-core';
import {
    // MOBILENETV2_OBJECT_SIZE,
    ObjectDetection,
    ObjectDetectionMethod,
    ObjectDetectionService,
    Versioned,
} from 'types/machineLearning';
// import { resizeToSquare } from 'utils/image';
// import {
//     load as ssdMobileNetV2Load,
//     SSDMobileNetV2Model,
// } from './modelWrapper/SSDMobileNetV2';

import * as SSDMobileNet from '@tensorflow-models/coco-ssd';

class SSDMobileNetV2 implements ObjectDetectionService {
    private ssdMobileNetV2Model: SSDMobileNet.ObjectDetection;
    public method: Versioned<ObjectDetectionMethod>;

    public constructor() {
        this.method = {
            value: 'SSDMobileNetV2',
            version: 1,
        };
    }

    private async init() {
        this.ssdMobileNetV2Model = await SSDMobileNet.load({
            // base: 'mobilenet_v2',
            // dataset: 'open_images',
            // modelUrl: '/models/open-images-ssd-mobilenet-v2/model.json',
        });
        console.log(
            'loaded ssdMobileNetV2Model',
            // await this.blazeFaceModel,
            tf.getBackend()
        );
    }

    public async detectObjects(image: ImageBitmap): Promise<ObjectDetection[]> {
        // const resized = resizeToSquare(image, MOBILENETV2_OBJECT_SIZE);
        const results = await this.detectObjectUsingModel(image);
        // const sizeCorrectedResults = results.map((result) => {
        //     const scale =
        //         Math.max(image.height, image.width) / MOBILENETV2_OBJECT_SIZE;

        //     const expandResultToOriginalSize: SSDMobileNet.DetectedObject = {
        //         ...result,
        //         bbox: result.bbox.map((x) => x * scale) as [
        //             number,
        //             number,
        //             number,
        //             number
        //         ],
        //     };
        //     return expandResultToOriginalSize;
        // });

        // return sizeCorrectedResults;

        return results;
    }

    private async getSSDMobileNetV2Model() {
        if (!this.ssdMobileNetV2Model) {
            await this.init();
        }

        return this.ssdMobileNetV2Model;
    }

    private disposeSSDMobileNetV2Model() {
        if (this.ssdMobileNetV2Model !== null) {
            this.ssdMobileNetV2Model = null;
        }
    }

    public async detectObjectUsingModel(imageBitmap: ImageBitmap) {
        const ssdMobileNetV2Model = await this.getSSDMobileNetV2Model();
        const tfImage = tf.browser.fromPixels(imageBitmap);
        const predictions = await ssdMobileNetV2Model.detect(tfImage);
        return predictions;
    }

    public async dispose() {
        const ssdMobileNetV2Model = await this.getSSDMobileNetV2Model();
        ssdMobileNetV2Model?.dispose();
        this.disposeSSDMobileNetV2Model();
    }
}

export default new SSDMobileNetV2();
